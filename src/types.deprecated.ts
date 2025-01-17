import { Nullish } from './types';

/**
 * @deprecated Use `Result` from `types.ts` instead.
 */
export type Result<T, E extends Error = Error> = T | E;

/** Contains either T, null, undefined or Error. */
export type NullishResult<T> = Result<Nullish<T>>;

/** Unwraps/extracts the wrapped value `T` from a union with undefined, null or error. */
export type Ok<T> = Exclude<T, Error | null | undefined>;
