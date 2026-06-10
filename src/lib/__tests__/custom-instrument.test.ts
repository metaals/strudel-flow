import { describe, it, expect } from 'vitest';
import {
  parseCustomInstrument,
  substitute,
  isCustomInstrumentEffect,
} from '../custom-instrument';

describe('parseCustomInstrument', () => {
  it('parses the documented example', () => {
    const code = [
      '@param GAIN: dial(0..1) = 0.5',
      '@param INST: dropdown(bd, sd, hh) = bd',
      '@param REPEAT: stepper(1..8) = 2',
      '---',
      'sound("$INST*$REPEAT").gain($GAIN)',
    ].join('\n');

    const { params, body } = parseCustomInstrument(code);
    expect(body).toBe('sound("$INST*$REPEAT").gain($GAIN)');
    expect(params).toHaveLength(3);

    const [gain, inst, repeat] = params;
    expect(gain).toMatchObject({ name: 'GAIN', control: 'dial', min: 0, max: 1, default: 0.5 });
    expect(inst).toMatchObject({ name: 'INST', control: 'dropdown', options: ['bd', 'sd', 'hh'], default: 'bd' });
    expect(repeat).toMatchObject({ name: 'REPEAT', control: 'stepper', min: 1, max: 8, step: 1, default: 2 });
  });

  it('parses dial step and toggle/text defaults', () => {
    const code = [
      '@param CUT: slider(20..2000 step 5) = 500',
      '@param ON: toggle = true',
      '@param LABEL: text = hello world',
      '---',
      'sound("bd")',
    ].join('\n');
    const { params } = parseCustomInstrument(code);
    expect(params[0]).toMatchObject({ control: 'dial', min: 20, max: 2000, step: 5, default: 500 });
    expect(params[1]).toMatchObject({ control: 'toggle', default: true });
    expect(params[2]).toMatchObject({ control: 'text', default: 'hello world' });
  });

  it('falls back to whole input as body when no separator/params', () => {
    const code = 'sound("bd sd hh")';
    const { params, body } = parseCustomInstrument(code);
    expect(params).toEqual([]);
    expect(body).toBe('sound("bd sd hh")');
  });

  it('uses range minimum as default when default omitted', () => {
    const { params } = parseCustomInstrument('@param X: dial(2..9)\n---\nx');
    expect(params[0].default).toBe(2);
  });
});

describe('substitute', () => {
  const { params, body } = parseCustomInstrument(
    '@param GAIN: dial(0..1) = 0.5\n@param INST: dropdown(bd, sd) = bd\n---\nsound("$INST").gain($GAIN)'
  );

  it('substitutes provided values', () => {
    const out = substitute(body, params, { GAIN: 0.8, INST: 'sd' });
    expect(out).toBe('sound("sd").gain(0.8)');
  });

  it('falls back to defaults for missing values', () => {
    const out = substitute(body, params, {});
    expect(out).toBe('sound("bd").gain(0.5)');
  });

  it('respects word boundaries so $IN does not clobber $INPUT', () => {
    const parsed = parseCustomInstrument('@param IN: text = bd\n@param INPUT: text = sd\n---\n$IN $INPUT');
    const out = substitute(parsed.body, parsed.params, {});
    expect(out).toBe('bd sd');
  });

  it('renders booleans as true/false', () => {
    const parsed = parseCustomInstrument('@param ON: toggle = false\n---\n$ON');
    expect(substitute(parsed.body, parsed.params, { ON: true })).toBe('true');
    expect(substitute(parsed.body, parsed.params, {})).toBe('false');
  });
});

describe('isCustomInstrumentEffect', () => {
  it('detects effect bodies starting with a dot', () => {
    expect(isCustomInstrumentEffect('@param G: dial(0..1) = 1\n---\n.gain($G)')).toBe(true);
  });

  it('treats source bodies as non-effect', () => {
    expect(isCustomInstrumentEffect('---\nsound("bd")')).toBe(false);
    expect(isCustomInstrumentEffect('sound("bd")')).toBe(false);
    expect(isCustomInstrumentEffect('')).toBe(false);
    expect(isCustomInstrumentEffect(undefined)).toBe(false);
  });
});
