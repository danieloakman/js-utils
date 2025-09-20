import { coerceHash } from './string';
import { AwaitedOnce, Comparator, Fn, MonoFn, SimpleMap } from './types';
import Result from './result';
export { debounce, throttle } from 'moderndash';

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
export function pipe(initialValue: unknown, ...funcs: MonoFn<unknown, unknown>[]): unknown;
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
export function flow(...funcs: MonoFn<unknown, unknown>[]): MonoFn<unknown, unknown>;
export function flow(...funcs: MonoFn<unknown, unknown>[]): MonoFn<unknown, unknown> {
  return (value: unknown) => pipe(value, ...funcs);
}

export function limitConcurrency<T extends (...args: any[]) => Promise<any>>(func: T, limit: number): T {
  let running = 0;
  const queue: Array<() => void> = [];

  return (async (...args: Parameters<T>) => {
    if (running >= limit) {
      await new Promise<void>(resolve => queue.push(resolve));
    }
    running++;
    try {
      return await func(...args);
    } finally {
      running--;
      queue.shift()?.();
    }
  }) as T;
}

export async function callConcurrently<T extends (...args: any[]) => Promise<any>>(
  funcs: Iterable<T>,
  limit: number,
): Promise<Awaited<ReturnType<T>>[]> {
  const results: ReturnType<T>[] = [];
  const executing = new Set<Promise<void>>();

  for (const func of funcs) {
    const promise = func();
    results.push(promise as ReturnType<T>);

    const executingPromise = promise.finally(() => {
      executing.delete(executingPromise);
    });
    executing.add(executingPromise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

export function isObjectLike(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isPromiseLike<T = unknown>(value: unknown): value is Promise<T> {
  return isObjectLike(value) && typeof value['then'] === 'function' && typeof value['catch'] === 'function';
}

/** Calls `fn` and returns its result as is, or if it throws an error it will return it as a value. */
export function attempt<T extends (...args: any[]) => never, E extends Error = Error>(
  fn: T,
  ...args: Parameters<T>
): Result.Err<E>;
export function attempt<T extends (...args: any[]) => Promise<unknown>, E extends Error = Error>(
  fn: T,
  ...args: Parameters<T>
): Promise<Result<Awaited<ReturnType<T>>, E>>;
export function attempt<T extends (...args: any[]) => unknown, E extends Error = Error>(
  fn: T,
  ...args: Parameters<T>
): Result<ReturnType<T>, E>;
export function attempt<T, E extends Error = Error>(promise: Promise<T>): Promise<Result<T, E>>;
export function attempt(arg: unknown, ...rest: unknown[]): unknown {
  if (isPromiseLike(arg)) return arg.then(Result.Ok).catch(Result.Err);
  if (typeof arg === 'function') {
    try {
      const result = arg.call(arg, ...rest);
      if (result instanceof Promise) return result.then(Result.Ok).catch(Result.Err);
      return Result.Ok(result);
    } catch (error) {
      return Result.Err(error as object);
    }
  }
  throw new Error('Cannot convert arg to result');
}

/** Wraps `fn` with an attempt call. So the resulting wrapped function's return type is a `Result`. */
export function tryResult<T extends (...args: any[]) => never>(fn: T): (...args: Parameters<T>) => Result.Err;
export function tryResult<T extends (...args: any[]) => Promise<any>>(
  fn: T,
): (...args: Parameters<T>) => Promise<Result<Awaited<ReturnType<T>>>>;
export function tryResult<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => Result<ReturnType<T>>;
export function tryResult(fn: Fn): Fn {
  return (...args: unknown[]) => {
    return attempt(fn, ...args);
  };
}

export function safeCall<T extends Fn<any[], never>>(fn: T, ...args: Parameters<T>): null;
export function safeCall<T extends Fn<any[], Promise<any>>>(
  fn: T,
  ...args: Parameters<T>
): Promise<Awaited<ReturnType<T>> | null>;
export function safeCall<T extends Fn>(fn: T, ...args: Parameters<T>): ReturnType<T> | null;
export function safeCall<T extends Fn>(fn: T, ...args: Parameters<T>): unknown {
  try {
    const result = fn(...args);
    return isObjectLike(result) && typeof result['catch'] === 'function' ? result['catch'](() => null) : result;
  } catch (_) {
    return null;
  }
}

export function sleep(ms: number): Promise<number> {
  return new Promise(resolve => setTimeout(() => resolve(ms), ms));
}

export const iife = <T>(fn: () => T): T => fn();

export const identity = <T>(v: T) => v;

export const constant =
  <T>(v: T) =>
  () =>
    v;

/** A function that does nothing. No-operation. */
export const noop = () => {};

/** Perform a side effect but still return `v` unchanged. */
export const effect =
  <T extends (...args: any[]) => unknown>(fn: T) =>
  (v: T): T => {
    fn(v);
    return v;
  };

export function isNullish(value: unknown): value is null | undefined {
  return value == null || value == undefined;
}

/**
 * @deprecated Use `Result.unwrap` instead.
 * @description Checks if `value` is not nullish or an error and returns it. This is analogous to the `unwrap` method in
 * Rust or any other Result implementation. Its use is for when you don't need or care to handle a non-ok value.
 * @throws {TypeError} Throws if `value` is an error or nullish.
 */
export function ok<T>({ data, error }: Result<T>): NonNullable<T> {
  if (error) throw error;
  if (isNullish(data)) throw new TypeError('Expected a non-nullish value.');
  return data as NonNullable<T>;
}

/**
 * @deprecated Use `Result.unwrap` instead.
 * @description Checks if `value` is nullish or an error, if it is then `defaultValue` is returned. Otherwise `value` is returned. */
export const okOr = <T, U>({ status, data }: Result<T>, defaultValue: U): T | U => {
  return status === 'success' ? data : defaultValue;
};

export const isError = (value: unknown): value is Error => value instanceof Error;

/**
 * Throws an error or error message. `throw new Error('...')` can't be used as an expression, but this can. So this
 * function opens some neat possibilities. Can also be used to combine more than one errors into an AggregateError.
 * @example
 * const foo = someNullishValue ?? raise('foo is nullish');
 * const str = possiblyEmptyString || raise('str is empty');
 */
export function raise(...exceptions: [string] | Error[]): never {
  if (exceptions.length === 1)
    throw typeof exceptions[0] === 'string' ? new Error(exceptions[0] as string) : exceptions[0];
  throw new AggregateError(exceptions);
}

/** Returns a function that will always raise an error. */
export function alwaysRaise(...exceptions: [string] | Error[]): () => never {
  return () => raise(...exceptions);
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
  (...args: Parameters<T>): boolean =>
    !fn(...args);

/** Wraps `fn` so that all calls to `fn` will return the same **FIRST** result. */
export const once = <T extends Fn>(fn: T): T => {
  let called = false;
  let result: ReturnType<T>;
  return ((...args: any[]) => {
    if (called) return result;
    called = true;
    return (result = fn(...args) as ReturnType<T>);
  }) as T;
};

export interface MemoizeOptions<T extends Fn> {
  /** This is used to create the key for a given set of parameters. */
  resolver?: (...args: Parameters<T>) => string;
  cache?: SimpleMap<ReturnType<T>>;
}

/** Wraps calls to `fn` with checks to an internal cache. */
export const memoize = <T extends Fn>(fn: T, options: MemoizeOptions<T> = {}): T => {
  const resolver = options.resolver ?? ((...args: Parameters<T>) => coerceHash(args).toString());
  const cache = options.cache ?? new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = resolver(...args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    // if (result instanceof Promise) return result.then(effect(v => cache.set(key, v)));
    cache.set(key, result as ReturnType<T>);
    return result;
  }) as T;
};

/**
 * @description Wraps any function into an async one. Useful for when the `Promise` API methods (`catch`, `finally`, `then`)
 * are more convenient than `try`/`catch`/`finally`. Obviously this is not appropriate for functions that are already
 * async, or that can be made async easily, i.e. a callback or some other anonymous function defined inline.
 */
export function toAsyncFn<T extends Fn>(fn: T): (...args: Parameters<T>) => Promise<AwaitedOnce<ReturnType<T>>> {
  // Check if already an async function:
  if (fn.constructor.name === 'AsyncFunction')
    return fn as (...args: Parameters<T>) => Promise<AwaitedOnce<ReturnType<T>>>;
  return async (...args: Parameters<T>) => (await fn(...args)) as AwaitedOnce<ReturnType<T>>;
}

// TODO: may need to change `Fn` usage to just `(...args: any[]) => any`, as it get's confused with Fn and MonoFn.
export function addTimeout<T extends Fn<any[], Promise<unknown>>>(
  fn: T,
  timeoutMs: number,
): (...args: Parameters<T>) => Promise<Result<Awaited<ReturnType<T>>>> {
  return (async (...args: Parameters<T>) => {
    let timeout: any = null;

    return Promise.race([
      new Promise(resolve => {
        timeout = setTimeout(
          () => resolve({ status: 'error', error: new Error(`${fn.name} timed out after ${timeoutMs}ms`) }),
          timeoutMs,
        );
      }),
      fn(...args)
        .then(Result.Ok)
        .catch(Result.Err)
        .finally(() => clearTimeout(timeout)),
    ]);
  }) as any;
}

/**
 * Converts a class constructor into a function. This omits the need to use `new` to create an instance of the class.
 */
export const classToFn = <T extends new (...args: any[]) => any>(
  klass: T,
): ((...args: ConstructorParameters<T>) => InstanceType<T>) => {
  return (...args: ConstructorParameters<T>) => new klass(...args);
};
