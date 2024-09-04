/* eslint-disable @typescript-eslint/no-unused-vars */

declare module 'bun' {
  interface Env {
    RUNTIME: string;
  }
}
export interface Fn<Args extends any[] = any[], Return = any> {
  (...args: Args): Return;
}

export interface AsyncFn<Args extends any[] = any[], Return = any> {
  (...args: Args): Promise<Return>;
}

export interface MonoFn<A, B = A> {
  (a: A): B;
}

export type Result<T, E extends Error = Error> = T | E;

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
  get size(): Promise<number>;
  get<U = T>(key: string): Promise<Nullish<U>>;
  delete(key: string): Promise<boolean>;
  set(key: string, value: string | T): Promise<boolean>;
  has(key: string): Promise<boolean>;
  clear(): Promise<boolean>;
  keys(): AsyncIterableIterator<string>;
}

/** For implementing simple string -> T maps. This is just a subset of a `Map<string, T>`.  */
export interface SimpleMap<T> {
  get(key: string): Nullish<T>;
  set(key: string, value: T): this;
  delete(key: string): boolean;
  has(key: string): boolean;
}

export abstract class Singleton {
  protected static _instance: any;

  /** Cannot directly instantiate this class, use the static `instance` method instead. */
  protected constructor() {}

  /**
   * Use this to access the only initialisable instance for this class. Note you must use a return
   * type when you override this, otherwise you'll get return type `any`.
   */
  public static instance(): any {
    return this._instance;
  }
}

export interface Comparator<T, R extends number | boolean> {
  (a: T, b: T): R;
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

/** Unions T with itself and with it wrapped in a Promise. */
export type PromiseOrValue<T> = T | Promise<T>;

export type StringTuple = readonly string[];

/**
 * Tail<['1', '2', '3']> = ['2', '3'].
 */
export type Tail<T extends StringTuple> = T extends readonly [infer _Head, ...infer Rest] ? Rest : [];

/**
 * Join<['1', '2'], " - "> = '1 - 2'.
 * Join<['1'], " - "> = '1'.
 * Join<[], 'x'> = ''.
 */
export type StringJoin<T extends StringTuple, Separator extends string> = T extends readonly []
  ? ''
  : T extends readonly [infer Head]
    ? Head
    : `${T[0]}${Separator}${StringJoin<Tail<T>, Separator>}`;

export type Concat<A extends any[], B extends any[]> = [...A, ...B];

export type Pop<T extends any[]> = T extends [...infer A, infer _B] ? A : [];
