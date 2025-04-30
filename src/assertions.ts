import { alwaysRaise } from './functional';

export function assert(value: unknown, message?: string | Error): asserts value {
  if (!value) {
    if (typeof message === 'string') throw new Error(message);
    else throw message ?? new Error('Assertion failed');
  }
}

/**
 * @deprecated Use `assert.throws` from node assert package instead or somewhere else.
 */
export const throws: (block: () => unknown, message?: string | Error) => void = alwaysRaise(
  '`throws` is deprecated, use `assert.throws` from node assert package instead or somewhere else.',
);

/**
 * Expect value to be `T`, and return it to allow for piping/chaining.
 * This doesn't actually *do* anything, it's just for type checking in tests.
 */
export const expectType = <T>(value: T) => value;

/**
 * @deprecated Use `assert.deepStrictEqual` from node assert package instead or somewhere else.
 * @description Wrapper for `deepStrictEqual` that asserts at the type level that `actual` and `expected` are the same type. */
export const equal: <T>(actual: T, expected: T, message?: string | Error) => boolean = alwaysRaise(
  '`equal` is deprecated, use `deepStrictEqual` from node assert package instead or somewhere else.',
);
