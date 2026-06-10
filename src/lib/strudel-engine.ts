import { evaluate, hush, getAudioContext as getStrudelAudioContext } from '@strudel/web';
import { generateOutputWithErrors } from './strudel';
import { logger } from './logger';
import type { AppNode } from '@/components/nodes';
import type { Edge } from '@xyflow/react';

export type StrudelErrorCode = 'KNOWN_WARNING' | 'EVAL_ERROR' | 'EMPTY_PATTERN';

// --- Audio master tap -------------------------------------------------------
// Insert a single master gain node in series between Strudel/superdough's output
// and the hardware destination, exposing the live AudioContext and master node
// so downstream code (recording, streaming, visualizers) can branch a tap off
// the master without altering what the user hears.
//
// superdough builds its output graph lazily on the first sound and connects its
// final node to `ctx.destination`. By shadowing `ctx.destination` with our own
// master gain (which we connect to the real destination) before the first sound
// plays, superdough routes through `master` transparently.
//
// Known limitation: superdough sets `ctx.destination.channelCount` to the
// hardware max during its lazy init; after shadowing, that assignment lands on
// the master gain instead. For the app's stereo default this is identical.
let _audioContext: AudioContext | null = null;
let _masterNode: GainNode | null = null;
let _audioMasterInitialized = false;

/**
 * Idempotently surface the single @strudel/web AudioContext and insert a master
 * gain node in series before the hardware destination. Safe to call repeatedly
 * (StrictMode / repeated setup); subsequent calls return the cached nodes.
 * Must run before the first sound plays so superdough picks up the shadowed
 * destination during its lazy graph init.
 */
export function initAudioMaster(): { ctx: AudioContext; master: GainNode } {
  if (_audioMasterInitialized && _audioContext && _masterNode) {
    return { ctx: _audioContext, master: _masterNode };
  }

  const ctx = getStrudelAudioContext();
  const realDestination = ctx.destination;
  const master = ctx.createGain();

  // superdough reads destination.maxChannelCount during its lazy init; mirror it
  // on the master gain so that code path behaves as if it had the real node.
  Object.defineProperty(master, 'maxChannelCount', {
    value: realDestination.maxChannelCount,
    configurable: true,
  });

  master.connect(realDestination);

  // Shadow ctx.destination so superdough's output lands in our master gain.
  Object.defineProperty(ctx, 'destination', {
    get: () => master,
    configurable: true,
  });

  _audioContext = ctx;
  _masterNode = master;
  _audioMasterInitialized = true;
  logger.debug('Audio master initialized', { maxChannelCount: realDestination.maxChannelCount });

  return { ctx, master };
}

/** Returns the live AudioContext used by @strudel/web (lazy-inits the master). */
export function getAudioContext(): AudioContext {
  return initAudioMaster().ctx;
}

/**
 * Returns the master gain node sitting between Strudel output and the hardware
 * destination (lazy-inits if needed). Branch a tap off it without changing level
 * via `getMasterNode().connect(analyser)` — a fan-out leaves the existing
 * `master → destination` path intact, so perceived volume is unchanged.
 */
export function getMasterNode(): GainNode {
  return initAudioMaster().master;
}

/**
 * Set the master output volume. `volume` is a linear gain (0 = silent, 1 = unity).
 * Applied with a short ramp to avoid clicks. Safe to call before/after init.
 */
export function setMasterVolume(volume: number): void {
  try {
    const master = getMasterNode();
    const now = master.context.currentTime;
    master.gain.setTargetAtTime(Math.max(0, volume), now, 0.01);
  } catch (e) {
    logger.warn('setMasterVolume failed', e);
  }
}

export interface StrudelEngineState {
  isRunning: boolean;
  lastPattern: string;
  lastDurationMs: number;
  lastErrorCount: number;
}

class StrudelEngine {
  private isRunning = false;
  private lastPattern = '';
  private lastDurationMs = 0;
  private lastErrorCount = 0;
  private debounceTimer: number | null = null;

  getState(): StrudelEngineState {
    return {
      isRunning: this.isRunning,
      lastPattern: this.lastPattern,
      lastDurationMs: this.lastDurationMs,
      lastErrorCount: this.lastErrorCount,
    };
  }

  private classifyError(err: unknown): StrudelErrorCode {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('got "undefined" instead of pattern') || msg.includes('Cannot read properties of undefined')) {
      return 'KNOWN_WARNING';
    }
    return 'EVAL_ERROR';
  }

  private getActivePattern(p: string): string {
    return p.split('\n').filter((line) => !line.trim().startsWith('//')).join('\n');
  }

  evaluatePattern(patternToEvaluate: string) {
    const active = this.getActivePattern(patternToEvaluate);
    const hasContent = active.replace(/setcpm\([^)]+\)\s*/g, '').trim();
    if (!hasContent) {
      if (this.isRunning) {
        try { hush(); } catch (e) { logger.warn('hush failed', e); }
        this.isRunning = false;
      }
      this.lastPattern = '';
      return;
    }
    if (active === this.lastPattern) return;
    this.isRunning = true;
    this.lastPattern = active;
    const start = performance.now();
    try {
      evaluate(active);
      const dur = performance.now() - start;
      logger.debug('Strudel evaluate success', { durationMs: dur, patternLength: active.length });
    } catch (err) {
      const code = this.classifyError(err);
      if (code === 'KNOWN_WARNING') {
        logger.pattern('Strudel pattern warning suppressed', err instanceof Error ? err.message : String(err));
      } else {
        logger.error('Strudel evaluation error', err, { code });
        this.lastErrorCount++;
      }
    }
  }

  debouncedEvaluate(pattern: string, immediate = false) {
    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (immediate || pattern.includes('setcpm(') || pattern.includes('scale(')) {
      this.evaluatePattern(pattern);
      return;
    }
    this.debounceTimer = window.setTimeout(() => {
      this.evaluatePattern(pattern);
      this.debounceTimer = null;
    }, 50);
  }

  stop() {
    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.isRunning = false;
    this.lastPattern = '';
    try { hush(); } catch (e) { logger.warn('hush failed on stop', e); }
  }

  generate(nodes: AppNode[], edges: Edge[], cpm: string, bpc: string) {
    const result = generateOutputWithErrors(nodes, edges, cpm, bpc);
    this.lastDurationMs = result.durationMs;
    this.lastErrorCount = result.errors.length;
    if (result.errors.length > 0) {
      logger.warn('Generate output errors', { count: result.errors.length, errors: result.errors });
    }
    logger.debug('Generate output', { durationMs: result.durationMs, nodeCount: nodes.length, edgeCount: edges.length, patternLength: result.pattern.length });
    return result;
  }

  forceEvaluate(nodes: AppNode[], edges: Edge[], cpm: string, bpc: string) {
    const { pattern } = this.generate(nodes, edges, cpm, bpc);
    this.evaluatePattern(pattern);
  }
}

export const strudelEngine = new StrudelEngine();