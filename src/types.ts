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

export interface Queue<T> {
  length: number;
  push: Array<T>['push'];
  shift: Array<T>['shift'];
  [Symbol.iterator]: Array<T>['values'];
}

export interface Stack<T> {
  length: number;
  push: Array<T>['push'];
  pop: Array<T>['pop'];
  [Symbol.iterator]: Array<T>['values'];
}

/** For implementing asynchronous maps/caches. */
export interface DataCache<T> {
  get<U = T>(key: string): Promise<Nullish<U>>;
  delete(key: string): Promise<boolean>;
  set(key: string, value: string | T): Promise<boolean>;
  has(key: string): Promise<boolean>;
  clear(): Promise<boolean>;
  keys(): AsyncIterableIterator<string>;
}
