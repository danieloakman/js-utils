import type { Fn } from './types';

/**
 * @description Creates a disposable object that you can add cleanup functions to. When the object falls out of
 * scope, all cleanup functions are called.
 * @example
 * // A block scope, or a function scope, or any other scope:
 * {
 *   await using defer = deferral();
 *   defer(() => console.log('cleanup'));
 * } // Logs 'cleanup'
 */
export const deferral = (): AsyncDisposable & Disposable & ((...cleanupFns: Fn[]) => void) => {
  const cleanup: Fn[] = [];
  return Object.assign(
    (...cleanupFns: Fn[]) => {
      cleanup.push(...cleanupFns);
    },
    {
      [Symbol.asyncDispose]: async () => {
        await Promise.all(cleanup.map(fn => fn()));
      },
      [Symbol.dispose]: () => {
        cleanup.forEach(fn => fn());
      },
    },
  );
};

export class Deferral implements AsyncDisposable, Disposable {
  private cleanup: Fn[] = [];

  public add(...fns: Fn[]) {
    this.cleanup.push(...fns);
  }

  public async [Symbol.asyncDispose]() {
    await Promise.all(this.cleanup.map(fn => fn()));
  }

  public [Symbol.dispose]() {
    this.cleanup.forEach(fn => fn());
  }
}
