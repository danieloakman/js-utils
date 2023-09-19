import { raise } from './functional';

export function assert(value: unknown, message?: string | Error): asserts value {
  if (!value) {
    if (typeof message === 'string') throw new Error(message);
    else throw message ?? new Error('Assertion failed');
  }
}

export const throws: (block: () => unknown, message?: string | Error) => void =
  Bun.env.RUNTIME === 'browser'
    ? () => raise("Can' use `throws` ")
    : (block, message) => {
        return require('assert').throws(block, message);
      };

/**
 * Expect value to be `T`, and return it to allow for piping/chaining.
 * This doesn't actually *do* anything, it's just for type checking in tests.
 */
export const expectType = <T>(value: T) => value;

/** Wrapper for `deepStrictEqual` that asserts at the type level that `actual` and `expected` are the same type. */
export const equal: <T>(actual: T, expected: T, message?: string | Error) => boolean =
  Bun.env.RUNTIME === 'browser'
    ? () => raise("Can't use `equal`, not implemented in browser.")
    : (actual, expected, message) => {
        return require('assert').deepStrictEqual(actual, expected, message);
      };
