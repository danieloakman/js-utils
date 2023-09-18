import { Fn, MonoFn, Ok } from './types';
export declare function pipe<A, B>(a: A, aFn: MonoFn<A, B>): B;
export declare function pipe<A, B, C>(a: A, aFn: MonoFn<A, B>, bFn: MonoFn<B, C>): C;
export declare function pipe<A, B, C, D>(a: A, aFn: MonoFn<A, B>, bFn: MonoFn<B, C>, cFn: MonoFn<C, D>): D;
export declare function pipe<A, B, C, D, E>(a: A, aFn: MonoFn<A, B>, bFn: MonoFn<B, C>, cFn: MonoFn<C, D>, dFn: MonoFn<D, E>): E;
export declare function pipe<A, B, C, D, E, F>(a: A, aFn: MonoFn<A, B>, bFn: MonoFn<B, C>, cFn: MonoFn<C, D>, dFn: MonoFn<D, E>, eFn: MonoFn<E, F>): F;
export declare function pipe<A, B, C, D, E, F, G>(a: A, aFn: MonoFn<A, B>, bFn: MonoFn<B, C>, cFn: MonoFn<C, D>, dFn: MonoFn<D, E>, eFn: MonoFn<E, F>, fFn: MonoFn<F, G>): G;
export declare function pipe<A, B, C, D, E, F, G, H>(a: A, aFn: MonoFn<A, B>, bFn: MonoFn<B, C>, cFn: MonoFn<C, D>, dFn: MonoFn<D, E>, eFn: MonoFn<E, F>, fFn: MonoFn<F, G>, gFn: MonoFn<G, H>): H;
export declare function pipe<A, B, C, D, E, F, G, H, I>(a: A, aFn: MonoFn<A, B>, bFn: MonoFn<B, C>, cFn: MonoFn<C, D>, dFn: MonoFn<D, E>, eFn: MonoFn<E, F>, fFn: MonoFn<F, G>, gFn: MonoFn<G, H>, hFn: MonoFn<H, I>): I;
export declare function pipe<A, B, C, D, E, F, G, H, I, J>(a: A, aFn: MonoFn<A, B>, bFn: MonoFn<B, C>, cFn: MonoFn<C, D>, dFn: MonoFn<D, E>, eFn: MonoFn<E, F>, fFn: MonoFn<F, G>, gFn: MonoFn<G, H>, hFn: MonoFn<H, I>, iFn: MonoFn<I, J>): J;
export declare function limitConcurrentCalls<T extends (...args: any[]) => Promise<any>>(func: T, limit: number): T;
export declare function isObjectLike(value: unknown): value is Record<PropertyKey, unknown>;
export declare function attempt<T extends Fn>(fn: T, ...args: Parameters<T>): ReturnType<T> | Error;
export declare function safeCall<T extends Fn>(fn: T, ...args: Parameters<T>): ReturnType<T> | null;
export declare function sleep(ms: number): Promise<number>;
export declare const iife: <T>(fn: () => T) => T;
export declare const identity: <T>(v: T) => T;
export declare const constant: <T>(v: T) => () => T;
/** A function that does nothing. No-operation. */
export declare const noop: () => void;
/** Perform a side effect but still return `v` unchanged. */
export declare const effect: <T>(fn: (v: T) => any) => (v: T) => T;
export declare function isNullish(value: unknown): value is null | undefined;
/**
 * @description Checks if `value` is not nullish or an error and returns it. This is analogous to the `unwrap` method in
 * Rust or any other Result implementation. Its use is for when you don't need or care to handle a non-ok value.
 * @throws {TypeError} Throws if `value` is an error or nullish.
 */
export declare function ok<T>(value: T): Ok<T>;
export declare const okOr: <T, U>(value: T, defaultValue: U) => U | Ok<T>;
export declare function raise(message: string): never;
export declare function raise(error: Error): never;
export declare function multiComparator<T>(...comparators: ((a: T, b: T) => number)[]): (a: T, b: T) => number;
