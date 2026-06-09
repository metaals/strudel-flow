const DEV = import.meta.env.DEV;

export const logger = {
  debug: (...args: unknown[]) => {
    if (DEV) console.debug('[SF]', ...args);
  },
  info: (...args: unknown[]) => {
    console.info('[SF]', ...args);
  },
  warn: (...args: unknown[]) => {
    console.warn('[SF]', ...args);
  },
  error: (...args: unknown[]) => {
    console.error('[SF]', ...args);
  },
  pattern: (...args: unknown[]) => {
    if (DEV) console.debug('[SF:pattern]', ...args);
  },
};
