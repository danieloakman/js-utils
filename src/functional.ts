import { Comparator, Fn, MonoFn, Ok } from './types';

export function pipe<A, B>(a: A, aFn: MonoFn<A, B>): B;
export function pipe<A, B, C>(a: A, aFn: MonoFn<A, B>, bFn: MonoFn<B, C>): C;
export function pipe<A, B, C, D>(a: A, aFn: MonoFn<A, B>, bFn: MonoFn<B, C>, cFn: MonoFn<C, D>): D;
export function pipe<A, B, C, D, E>(
  a: A,
  aFn: MonoFn<A, B>,
  bFn: MonoFn<B, C>,
  cFn: MonoFn<C, D>,
  dFn: MonoFn<D, E>,
): E;
export function pipe<A, B, C, D, E, F>(
  a: A,
  aFn: MonoFn<A, B>,
  bFn: MonoFn<B, C>,
  cFn: MonoFn<C, D>,
  dFn: MonoFn<D, E>,
  eFn: MonoFn<E, F>,
): F;
export function pipe<A, B, C, D, E, F, G>(
  a: A,
  aFn: MonoFn<A, B>,
  bFn: MonoFn<B, C>,
  cFn: MonoFn<C, D>,
  dFn: MonoFn<D, E>,
  eFn: MonoFn<E, F>,
  fFn: MonoFn<F, G>,
): G;
export function pipe<A, B, C, D, E, F, G, H>(
  a: A,
  aFn: MonoFn<A, B>,
  bFn: MonoFn<B, C>,
  cFn: MonoFn<C, D>,
  dFn: MonoFn<D, E>,
  eFn: MonoFn<E, F>,
  fFn: MonoFn<F, G>,
  gFn: MonoFn<G, H>,
): H;
export function pipe<A, B, C, D, E, F, G, H, I>(
  a: A,
  aFn: MonoFn<A, B>,
  bFn: MonoFn<B, C>,
  cFn: MonoFn<C, D>,
  dFn: MonoFn<D, E>,
  eFn: MonoFn<E, F>,
  fFn: MonoFn<F, G>,
  gFn: MonoFn<G, H>,
  hFn: MonoFn<H, I>,
): I;
export function pipe<A, B, C, D, E, F, G, H, I, J>(
  a: A,
  aFn: MonoFn<A, B>,
  bFn: MonoFn<B, C>,
  cFn: MonoFn<C, D>,
  dFn: MonoFn<D, E>,
  eFn: MonoFn<E, F>,
  fFn: MonoFn<F, G>,
  gFn: MonoFn<G, H>,
  hFn: MonoFn<H, I>,
  iFn: MonoFn<I, J>,
): J;
export function pipe(initialValue: unknown, ...funcs: MonoFn<unknown, unknown>[]): unknown {
  let result = initialValue;
  for (const func of funcs) result = func(result);
  return result;
}

export function limitConcurrentCalls<T extends (...args: any[]) => Promise<any>>(func: T, limit: number): T {
  const resolves: ((...any: any[]) => void)[] = [];

  return (async (...args: Parameters<T>) => {
    if (resolves.length >= limit) await new Promise(resolve => resolves.push(resolve));
    try {
      return await func(...args);
    } finally {
      resolves.shift()?.();
    }
  }) as T;
}

export function isObjectLike(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null;
}

export function attempt<T extends Fn<any[], Promise<any>>>(
  fn: T,
  ...args: Parameters<T>
): Promise<Awaited<ReturnType<T>> | Error>;
export function attempt<T extends Fn>(fn: T, ...args: Parameters<T>): ReturnType<T> | Error;
export function attempt<T extends Fn>(fn: T, ...args: Parameters<T>): any {
  try {
    const result = fn(...args);
    return isObjectLike(result) && typeof result.catch === 'function' ? result.catch((e: Error) => e) : result;
  } catch (err) {
    return err as Error;
  }
}

export function safeCall<T extends Fn>(fn: T, ...args: Parameters<T>): ReturnType<T> | null {
  try {
    const result = fn(...args);
    return isObjectLike(result) && typeof result.catch === 'function' ? result.catch(() => null) : result;
  } catch (_) {
    return null;
  }
}

export function sleep(ms: number): Promise<number> {
  return new Promise(resolve => setTimeout(() => resolve(ms), ms));
}

export const iife = <T>(fn: () => T) => fn();

export const identity = <T>(v: T) => v;

export const constant =
  <T>(v: T) =>
  () =>
    v;

/** A function that does nothing. No-operation. */
export const noop = () => {};

/** Perform a side effect but still return `v` unchanged. */
export const effect =
  <T>(fn: (v: T) => any) =>
  (v: T) => {
    fn(v);
    return v;
  };

export function isNullish(value: unknown): value is null | undefined {
  return value == null || value == undefined;
}

export function isOk<T>(value: T): value is Ok<T> {
  return !isNullish(value) && !(value instanceof Error);
}

/**
 * @description Checks if `value` is not nullish or an error and returns it. This is analogous to the `unwrap` method in
 * Rust or any other Result implementation. Its use is for when you don't need or care to handle a non-ok value.
 * @throws {TypeError} Throws if `value` is an error or nullish.
 */
export function ok<T>(value: T): Ok<T> {
  if (value instanceof Error) throw value;
  if (isNullish(value)) throw new TypeError('Expected a non-nullish value.');
  return value as Ok<T>;
}

// TODO: fill jsdoc
export const okOr = <T, U>(value: T, defaultValue: U): Ok<T> | U => {
  if (value instanceof Error) return defaultValue;
  if (isNullish(value)) return defaultValue;
  return value as Ok<T>;
};

// TODO: fill jsdoc
export function raise(message: string): never;
export function raise(error: Error): never;
export function raise(exception: string | Error): never {
  throw typeof exception === 'string' ? new Error(exception) : exception;
}

// TODO: fill jsdoc
export function multiComparator<T>(...comparators: Comparator<T>[]): Comparator<T> {
  return (a: T, b: T) => {
    for (const comparator of comparators) {
      const result = comparator(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };
}

/** Wraps `fn` so that all calls to `fn` will return the same **FIRST** result. */
export const once = <T extends Fn>(fn: T): T => {
  let called = false;
  let result: ReturnType<T>;
  return ((...args: any[]) => {
    if (called) return result;
    called = true;
    return (result = fn(...args));
  }) as T;
};
