import { importSync, nodeOnly } from './misc';
import { iife } from './functional';

export { throws } from 'assert';
export function assert(value: unknown, message?: string | Error): asserts value {
  if (!value) {
    if (typeof message === 'string') throw new Error(message);
    else throw message ?? new Error('Assertion failed');
  }
}

/**
 * Expect value to be `T`, and return it to allow for piping/chaining.
 * This doesn't actually *do* anything, it's just for type checking in tests.
 */
export const expectType = <T>(value: T) => value;

/** Wrapper for `deepStrictEqual` that asserts at the type level that `actual` and `expected` are the same type. */
export const equal = nodeOnly(<T>(actual: T, expected: T, message?: string | Error) =>
  iife((assert = importSync('assert')) => assert.deepStrictEqual(actual, expected, message)),
);
