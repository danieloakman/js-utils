export interface Fn<Args extends any[] = any[], Return = any> {
  (...args: Args): Return;
}

export interface MonoFn<A, B = A> {
  (a: A): B;
}

export type Result<T> = T | Error;

/** Contains either T, null or undefined. */
export type Nullish<T> = T | null | undefined;

/** Contains either T, null, undefined or Error. */
export type NullishResult<T> = Result<Nullish<T>>;

/** Unwraps/extracts the wrapped value `T` from a union with undefined, null or error. */
export type Ok<T> = Exclude<T, Error | null | undefined>;
