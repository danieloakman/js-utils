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
export const deferral = (): AsyncDisposable & ((...cleanupFns: Fn[]) => void) => {
  const cleanup: Fn[] = [];
  return Object.assign(
    (...cleanupFns: Fn[]) => {
      cleanup.push(...cleanupFns);
    },
    {
      [Symbol.asyncDispose]: async () => {
        await Promise.all(cleanup.map(fn => fn()));
      },
    },
  );
};
