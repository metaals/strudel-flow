import type { AppNode } from '@/components/nodes/types';

const NOTES = ['0', '1', '2', '3', '4', '5', '6', '7'];

function applyColumnModifier(pattern: string, modifier: any) {
  if (!modifier || modifier.type === 'off') return pattern;
  return modifier.type === 'modifier' ? `${pattern}${modifier.value}` : pattern;
}

export function padOutput(node: AppNode, strudelString: string): string {
  const { data } = node;
  const grid = data.grid || Array(16).fill(null).map(() => Array(8).fill(false));
  const columnModifiers = data.columnModifiers || {};
  const noteGroups = data.noteGroups || {};

  const generateStepPattern = (row: boolean[], stepIdx: number) => {
    const individualNotes = row.map((on, noteIdx) => (on ? NOTES[noteIdx] : null)).filter(Boolean);
    const stepGroups = noteGroups[stepIdx] || [];
    const groupPatterns = stepGroups.map((group) => `<${group.map((noteIdx) => NOTES[noteIdx]).join(' ')}>`);
    const allPatterns = [...individualNotes, ...groupPatterns];
    if (allPatterns.length === 0) return '';
    const separator = (data.mode || 'arp') === 'arp' ? ' ' : ', ';
    const stepPattern = `[${allPatterns.join(separator)}]`;
    const columnModifier = columnModifiers[stepIdx];
    if (columnModifier && columnModifier.type !== 'off') {
      return applyColumnModifier(stepPattern, columnModifier);
    }
    return stepPattern;
  };

  const steps = data.steps || 5;
  const stepPatternsWithEmpty = grid.slice(0, steps).map((row, stepIdx) => {
    const step = generateStepPattern(row, stepIdx);
    return step === '' ? '~' : step;
  });
  const pattern = stepPatternsWithEmpty.join(' ');

  if (!pattern || !pattern.trim() || /^[~\s[\]]*$/.test(pattern.trim())) {
    return strudelString;
  }

  const octavePart = data.octave ? data.octave : '';
  const scale = `${data.selectedKey || 'C'}${octavePart}:${data.selectedScaleType || 'major'}`;

  return strudelString ? `${strudelString}.n("${pattern}").scale("${scale}")` : `n("${pattern}").scale("${scale}")`;
}

export function arpeggiatorOutput(node: AppNode, strudelString: string): string {
  const { data } = node;
  const key = data.selectedKey || 'C';
  const scaleType = data.selectedScaleType || 'major';
  const octave = data.octave || 4;
  const octaveRange = data.octaveRange || 2;
  const pattern = data.selectedPattern || 'up';
  const chordType = data.selectedChordType || 'major';

  const scale = `${key}${octave}:${scaleType}`;
  const arpCall = `arp("${pattern}").arpMode("${chordType}").arpRange(${octaveRange})`;
  return strudelString ? `${strudelString}.n("0 1 2 3").scale("${scale}").${arpCall}` : `n("0 1 2 3").scale("${scale}").${arpCall}`;
}

const CHORD_INTERVALS = {
  major: { triad: [0, 4, 7], seventh: [0, 4, 7, 11], ninth: [0, 4, 7, 11, 14], eleventh: [0, 4, 7, 11, 14, 17] },
  minor: { triad: [0, 3, 7], seventh: [0, 3, 7, 10], ninth: [0, 3, 7, 10, 14], eleventh: [0, 3, 7, 10, 14, 17] },
};

function getChordNotes(rootNote: number, scaleType: 'major' | 'minor', complexity: string) {
  const intervals = CHORD_INTERVALS[scaleType][complexity as keyof typeof CHORD_INTERVALS.major] || CHORD_INTERVALS[scaleType].triad;
  return intervals.map((interval) => rootNote + interval);
}

export function chordOutput(node: AppNode, strudelString: string): string {
  const { data } = node;
  const pressedKeys = data.pressedKeys || [];
  if (pressedKeys.length === 0) return strudelString;
  const key = data.selectedKey || 'C';
  const scaleType = (data.scaleType as 'major' | 'minor') || 'major';
  const octave = data.octave || 4;
  const complexity = data.chordComplexity || 'triad';
  const scale = `${key}${octave}:${data.selectedScaleType || 'major'}`;
  const chordNotes = pressedKeys.map((rootNote) => {
    const notes = getChordNotes(rootNote, scaleType, complexity);
    return `[${notes.join(' ')}]`;
  });
  const notePattern = chordNotes.join(' ');
  return strudelString ? `${strudelString}.n("${notePattern}").scale("${scale}")` : `n("${notePattern}").scale("${scale}")`;
}

export function customOutput(node: AppNode, strudelString: string): string {
  const { data } = node;
  const pattern = data.customPattern || 'c3';
  return strudelString ? `${strudelString}.stack("${pattern}")` : `"${pattern}"`;
}

export function polyrhythmOutput(node: AppNode, strudelString: string): string {
  const { data } = node;
  const patterns = [];
  if (data.pattern1Active !== false && data.polyPattern1) patterns.push(`sound("${data.polySound1 || 'bd'}").struct("${data.polyPattern1}")`);
  if (data.pattern2Active !== false && data.polyPattern2) patterns.push(`sound("${data.polySound2 || 'sd'}").struct("${data.polyPattern2}")`);
  if (data.pattern3Active && data.polyPattern3) patterns.push(`sound("${data.polySound3 || 'hh'}").struct("${data.polyPattern3}")`);
  if (patterns.length === 0) return strudelString;
  const stackPattern = patterns.length === 1 ? patterns[0] : `stack(${patterns.join(', ')})`;
  return strudelString ? `${strudelString}.${stackPattern}` : stackPattern;
}

export function beatMachineOutput(node: AppNode, strudelString: string): string {
  const { data } = node;
  const rows = data.rows || [];
  if (rows.length === 0) return strudelString;
  const patterns = rows.map((row) => {
    const pattern = row.pattern.map((on) => (on ? 'x' : '~')).join(' ');
    return `sound("${row.instrument}").struct("${pattern}")`;
  });
  const stackPattern = patterns.length === 1 ? patterns[0] : `stack(${patterns.join(', ')})`;
  return strudelString ? `${strudelString}.${stackPattern}` : stackPattern;
}