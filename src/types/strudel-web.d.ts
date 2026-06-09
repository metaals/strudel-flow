declare module '@strudel/web' {
  interface Scheduler {
    now(): number;
  }

  interface Repl {
    scheduler: Scheduler;
  }

  export function initStrudel(): Promise<Repl>;
  export function evaluate(code: string): void;
  export function hush(): void;
  export function samples(url: string): void;
}