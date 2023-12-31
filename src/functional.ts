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

export function flow<A, B>(aFn: MonoFn<A, B>): MonoFn<A, B>;
export function flow<A, B, C>(aFn: MonoFn<A, B>, bFn: MonoFn<B, C>): MonoFn<A, C>;
export function flow<A, B, C, D>(aFn: MonoFn<A, B>, bFn: MonoFn<B, C>, cFn: MonoFn<C, D>): MonoFn<A, D>;
export function flow<A, B, C, D, E>(
  aFn: MonoFn<A, B>,
  bFn: MonoFn<B, C>,
  cFn: MonoFn<C, D>,
  dFn: MonoFn<D, E>,
): MonoFn<A, E>;
export function flow<A, B, C, D, E, F>(
  aFn: MonoFn<A, B>,
  bFn: MonoFn<B, C>,
  cFn: MonoFn<C, D>,
  dFn: MonoFn<D, E>,
  eFn: MonoFn<E, F>,
): MonoFn<A, F>;
export function flow<A, B, C, D, E, F, G>(
  aFn: MonoFn<A, B>,
  bFn: MonoFn<B, C>,
  cFn: MonoFn<C, D>,
  dFn: MonoFn<D, E>,
  eFn: MonoFn<E, F>,
  fFn: MonoFn<F, G>,
): MonoFn<A, G>;
export function flow<A, B, C, D, E, F, G, H>(
  aFn: MonoFn<A, B>,
  bFn: MonoFn<B, C>,
  cFn: MonoFn<C, D>,
  dFn: MonoFn<D, E>,
  eFn: MonoFn<E, F>,
  fFn: MonoFn<F, G>,
  gFn: MonoFn<G, H>,
): MonoFn<A, H>;
export function flow<A, B, C, D, E, F, G, H, I>(
  aFn: MonoFn<A, B>,
  bFn: MonoFn<B, C>,
  cFn: MonoFn<C, D>,
  dFn: MonoFn<D, E>,
  eFn: MonoFn<E, F>,
  fFn: MonoFn<F, G>,
  gFn: MonoFn<G, H>,
  hFn: MonoFn<H, I>,
): MonoFn<A, I>;
export function flow<A, B, C, D, E, F, G, H, I, J>(
  aFn: MonoFn<A, B>,
  bFn: MonoFn<B, C>,
  cFn: MonoFn<C, D>,
  dFn: MonoFn<D, E>,
  eFn: MonoFn<E, F>,
  fFn: MonoFn<F, G>,
  gFn: MonoFn<G, H>,
  hFn: MonoFn<H, I>,
  iFn: MonoFn<I, J>,
): MonoFn<A, J>;
export function flow(...funcs: MonoFn<unknown, unknown>[]): MonoFn<unknown, unknown> {
  // @ts-ignore
  return (value: unknown) => pipe(value, ...funcs);
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

/** Checks if `value` is nullish or an error, if it is then `defaultValue` is returned. Otherwise `value` is returned. */
export const okOr = <T, U>(value: T, defaultValue: U): Ok<T> | U => {
  return value instanceof Error || isNullish(value) ? defaultValue : (value as Ok<T>);
};

/**
 * Throws an error or error message. `throw new Error('...')` can't be used as an expression, but this can. So this
 * function opens some neat possibilities.
 * @example
 * const foo = someNullishValue ?? raise('foo is nullish');
 * const str = possiblyEmptyString || raise('str is empty');
 */
export function raise(exception: string | Error): never {
  throw typeof exception === 'string' ? new Error(exception) : exception;
}

/** Combines any number of comparators into a single comparator. Can be used for sorting or equality. */
export function multiComparator<T, R extends number | boolean>(...comparators: Comparator<T, R>[]): Comparator<T, R> {
  return (a: T, b: T) => {
    let isBool = false;
    for (const comparator of comparators) {
      const result = comparator(a, b);
      isBool = typeof result === 'boolean';
      if (result) return result;
    }
    return (isBool ? false : 0) as R;
  };
}

/** Wraps `fn` as `!fn`. */
export const not =
  <T extends Fn>(fn: T) =>
  (...args: Parameters<T>) =>
    !fn(...args);

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
