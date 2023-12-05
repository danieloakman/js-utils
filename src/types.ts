export interface Fn<Args extends any[] = any[], Return = any> {
  (...args: Args): Return;
}

export interface AsyncFn<Args extends any[] = any[], Return = any> {
  (...args: Args): Promise<Return>;
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

export interface Comparator<T> {
  (a: T, b: T): number;
}

/** Unwraps a Promise<T> **once**, becoming just T. */
export type AwaitedOnce<T> = T extends Promise<infer U> ? U : T;

export type Split<S extends string, Sep extends string> = string extends S
  ? string[]
  : S extends ''
  ? []
  : S extends `${infer T}${Sep}${infer U}`
  ? [T, ...Split<U, Sep>]
  : [S];

export type ObjectWithValueAtPath<Path extends string[], Value> = Path extends [infer First, ...infer Rest]
  ? First extends PropertyKey
    ? Record<First, ObjectWithValueAtPath<Rest extends string[] ? Rest : never, Value>>
    : never
  : Value;

/**
 * @example
 * type A = { a: string }
 * type B = { b: number }
 * type C = UnionToIntersection<A | B>
 *      ^? { a: string } & { b: number }
 */
export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
