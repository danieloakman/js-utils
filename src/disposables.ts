import type { Fn } from './types';
import { forEach, map, toArray } from 'iteragain';

class ArrayReverse<T> implements IterableIterator<T> {
  private index = -1;
  constructor(private readonly arr: Array<T>) {
    this.index = arr.length - 1;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(): IteratorResult<T> {
    const done = this.index < 0;
    return { value: this.arr[this.index--], done } as IteratorResult<T>;
  }
}

export interface DeferralFn extends AsyncDisposable, Disposable {
  (...cleanupFns: Fn[]): void;
}

export interface DeferralOptions {
  /**
   * The call order of the cleanup functions.
   * - 'fifo' (first-in-first-out)
   * - 'lifo' (last-in-first-out)
   * @default 'lifo'
   */
  order?: 'lifo' | 'fifo';
}

/**
 * @description Creates a disposable object that you can add cleanup functions to. When the object falls out of
 * scope, all cleanup functions are called.
 * @example
 * // An async or sync block scope, or a function scope, or any other scope:
 * {
 *   await using defer = deferral();
 *   // Can also do this, but the deferred functions won't be awaited on:
 *   // using defer = deferral();
 *   defer(() => console.log('cleanup'));
 * } // Logs 'cleanup'
 */
export const deferral = ({ order = 'lifo' }: DeferralOptions = {}): DeferralFn => {
  const cleanup: Fn[] = [];
  return Object.assign(
    (...cleanupFns: Fn[]) => {
      cleanup.push(...cleanupFns);
    },
    {
      [Symbol.asyncDispose]: async () => {
        await Promise.all(
          order === 'fifo' ? cleanup.map(fn => fn()) : toArray(map(new ArrayReverse(cleanup), fn => fn())),
        );
      },
      [Symbol.dispose]: () => {
        if (order === 'fifo') forEach(cleanup, fn => fn());
        else forEach(new ArrayReverse(cleanup), fn => fn());
      },
    },
  );
};

/**
 * @description An object that can be used to defer and schedule cleanup functions when it falls out of scope.
 * @example
 * {
 *   using defer = new Deferral();
 *   // OR:
 *   // await using defer = new Deferral();
 *   defer.add(() => console.log('cleanup'));
 * } // Logs 'cleanup'
 */
export class Deferral implements AsyncDisposable, Disposable {
  private cleanup: Fn[] = [];
  private options: DeferralOptions;
  constructor({ order = 'lifo' }: DeferralOptions = {}) {
    this.options = { order };
  }
  public add(...fns: Fn[]) {
    this.cleanup.push(...fns);
  }

  public async [Symbol.asyncDispose]() {
    await Promise.all(
      this.options.order === 'fifo'
        ? this.cleanup.map(fn => fn())
        : toArray(map(new ArrayReverse(this.cleanup), fn => fn())),
    );
  }

  public [Symbol.dispose]() {
    if (this.options.order === 'fifo') forEach(this.cleanup, fn => fn());
    else forEach(new ArrayReverse(this.cleanup), fn => fn());
  }
}
