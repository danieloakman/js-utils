// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Result {
  export type Ok<T = object> = { status: 'success'; data: T; error: undefined };
  export type Error<E extends object = object> = { status: 'error'; error: E; data: undefined };
}

export type Result<T = object, E extends Error = Error> = Result.Ok<T> | Result.Error<E>;

export const Result = {
  Ok: <T>(data: T) => ({ status: 'success', data }) as Result.Ok<T>,
  Error: <E extends object>(error: E) => ({ status: 'error', error }) as Result.Error<E>,
} as const;

export default Result;
