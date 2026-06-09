import { evaluate, hush } from '@strudel/web';
import { generateOutputWithErrors } from './strudel';
import { logger } from './logger';
import type { AppNode } from '@/components/nodes';
import type { Edge } from '@xyflow/react';

export type StrudelErrorCode = 'KNOWN_WARNING' | 'EVAL_ERROR' | 'EMPTY_PATTERN';

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