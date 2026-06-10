export type CustomParamControl =
  | 'dial'
  | 'stepper'
  | 'dropdown'
  | 'toggle'
  | 'text';

export type CustomParamValue = number | string | boolean;

export interface CustomParam {
  name: string;
  control: CustomParamControl;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  default: CustomParamValue;
}

export interface ParsedCustomInstrument {
  params: CustomParam[];
  body: string;
}

const PARAM_LINE = /^@param\s+(\w+)\s*:\s*(.+)$/;
const CONTROL_SPEC = /^(\w+)\s*(?:\(([^)]*)\))?$/;
const RANGE = /^([-\d.]+)\.\.([-\d.]+)(?:\s+step\s+([-\d.]+))?$/;

function parseParamLine(line: string): CustomParam | null {
  const m = PARAM_LINE.exec(line);
  if (!m) return null;
  const name = m[1];

  let rest = m[2].trim();
  let defaultRaw: string | undefined;
  const eq = rest.indexOf('=');
  if (eq >= 0) {
    defaultRaw = rest.slice(eq + 1).trim();
    rest = rest.slice(0, eq).trim();
  }

  const cm = CONTROL_SPEC.exec(rest);
  if (!cm) return null;
  const kind = cm[1].toLowerCase();
  const inner = (cm[2] ?? '').trim();

  switch (kind) {
    case 'dial':
    case 'slider': {
      const r = RANGE.exec(inner);
      const min = r ? parseFloat(r[1]) : 0;
      const max = r ? parseFloat(r[2]) : 1;
      const step = r && r[3] !== undefined ? parseFloat(r[3]) : undefined;
      const def =
        defaultRaw !== undefined && defaultRaw !== '' ? parseFloat(defaultRaw) : min;
      return {
        name,
        control: 'dial',
        min,
        max,
        step,
        default: Number.isNaN(def) ? min : def,
      };
    }
    case 'stepper': {
      const r = RANGE.exec(inner);
      const min = r ? Math.round(parseFloat(r[1])) : 0;
      const max = r ? Math.round(parseFloat(r[2])) : 10;
      const def =
        defaultRaw !== undefined && defaultRaw !== ''
          ? Math.round(parseFloat(defaultRaw))
          : min;
      return {
        name,
        control: 'stepper',
        min,
        max,
        step: 1,
        default: Number.isNaN(def) ? min : def,
      };
    }
    case 'dropdown': {
      const options = inner
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
      const def =
        defaultRaw !== undefined && defaultRaw !== ''
          ? defaultRaw
          : options[0] ?? '';
      return { name, control: 'dropdown', options, default: def };
    }
    case 'toggle': {
      const def = defaultRaw !== undefined ? defaultRaw.toLowerCase() === 'true' : false;
      return { name, control: 'toggle', default: def };
    }
    case 'text':
    default: {
      const def = defaultRaw ?? '';
      return { name, control: 'text', default: def };
    }
  }
}

export function parseCustomInstrument(code: string): ParsedCustomInstrument {
  const text = code ?? '';
  const lines = text.split('\n');
  const sep = lines.findIndex((l) => l.trim() === '---');

  let headerLines: string[];
  let body: string;
  if (sep >= 0) {
    headerLines = lines.slice(0, sep);
    body = lines.slice(sep + 1).join('\n');
  } else {
    headerLines = [];
    body = text;
  }

  const params: CustomParam[] = [];
  for (const line of headerLines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('@param')) continue;
    const param = parseParamLine(trimmed);
    if (param) params.push(param);
  }

  return { params, body: body.trim() };
}

export function substitute(
  body: string,
  params: CustomParam[],
  values: Record<string, CustomParamValue> | undefined
): string {
  let result = body;
  for (const p of params) {
    const raw = values?.[p.name];
    const v = raw === undefined || raw === null ? p.default : raw;
    const str = typeof v === 'boolean' ? (v ? 'true' : 'false') : String(v);
    const re = new RegExp('\\$' + p.name + '\\b', 'g');
    result = result.replace(re, str);
  }
  return result;
}

export function isCustomInstrumentEffect(code?: string): boolean {
  if (!code) return false;
  const { body } = parseCustomInstrument(code);
  return body.startsWith('.');
}
