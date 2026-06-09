const DEV = import.meta.env.DEV;

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'pattern';
type LogEntry = { ts: string; level: LogLevel; args: unknown[]; context?: Record<string, unknown> };

const levelOrder: Record<LogLevel, number> = { debug: 0, pattern: 0, info: 1, warn: 2, error: 3 };
function getStoredLevel(): LogLevel {
  try {
    return (localStorage.getItem('sf_log_level') as LogLevel) || (DEV ? 'debug' : 'info');
  } catch {
    return DEV ? 'debug' : 'info';
  }
}
let currentLevel: LogLevel = getStoredLevel();
const buffer: LogEntry[] = [];
const maxBuffer = 200;

function shouldLog(level: LogLevel) {
  if (level === 'pattern' && !DEV) {
    try {
      if (!new URLSearchParams(window.location.search).has('debug')) return false;
    } catch { return false; }
  }
  return levelOrder[level] >= levelOrder[currentLevel] || currentLevel === 'debug';
}

function push(level: LogLevel, args: unknown[], context?: Record<string, unknown>) {
  const entry: LogEntry = { ts: new Date().toISOString(), level, args, context };
  buffer.push(entry);
  if (buffer.length > maxBuffer) buffer.shift();
  if (!shouldLog(level)) return;
  const prefix = `[SF${context ? ':' + JSON.stringify(context) : ''}]`;
  const method = level === 'error' ? console.error : level === 'warn' ? console.warn : level === 'debug' || level === 'pattern' ? console.debug : console.info;
  method(prefix, ...args);
}

export const logger = {
  setLevel: (lvl: LogLevel) => { currentLevel = lvl; try { localStorage.setItem('sf_log_level', lvl); } catch { /* ignore */ } },
  getLevel: () => currentLevel,
  getBuffer: () => [...buffer],
  clearBuffer: () => { buffer.length = 0; },
  debug: (...args: unknown[]) => push('debug', args),
  info: (...args: unknown[]) => push('info', args),
  warn: (...args: unknown[]) => push('warn', args),
  error: (...args: unknown[]) => push('error', args),
  pattern: (...args: unknown[]) => push('pattern', args),
  time: (label: string) => { if (DEV) console.time(`[SF] ${label}`); },
  timeEnd: (label: string) => { if (DEV) console.timeEnd(`[SF] ${label}`); },
};