// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Result {
  export type Ok<T = object> = { status: 'success'; data: T; error: undefined };
  export type Error<E extends object = object> = { status: 'error'; error: E; data: undefined };
}

export type Result<T = object, E extends Error = Error> = Result.Ok<T> | Result.Error<E>;

interface CreateError {
  <E extends object>(error: E): Result.Error<E>;
  (...args: ConstructorParameters<typeof Error>): Result.Error<Error>;
}

export const Result = {
  Ok: <T>(data: T) => ({ status: 'success', data }) as Result.Ok<T>,
  Error: ((error: object) => ({ status: 'error', error })) as CreateError,
  /**
   * @description If the provided result is a success, return the data.
   * If a default value is provided and there's an error, return the default value.
   * @throws {Error} If the provided result is an error.
   */
  unwrap: <T>({ data, error }: Result<T>, defaultValue?: T) => {
    if (error) {
      if (defaultValue) return defaultValue;
      throw error;
    }
    return data;
  },
} as const;

export default Result;
