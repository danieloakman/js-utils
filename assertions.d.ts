export declare function assert(value: unknown, message?: string | Error): asserts value;
export declare const throws: (block: () => unknown, message?: string | Error) => void;
/**
 * Expect value to be `T`, and return it to allow for piping/chaining.
 * This doesn't actually *do* anything, it's just for type checking in tests.
 */
export declare const expectType: <T>(value: T) => T;
/** Wrapper for `deepStrictEqual` that asserts at the type level that `actual` and `expected` are the same type. */
export declare const equal: <T>(actual: T, expected: T, message?: string | Error) => boolean;
