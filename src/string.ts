import { isObjectLike } from './functional';
import { sortByKeys } from './object';
import { Nullish } from './types';

/**
 * @see https://stackoverflow.com/a/52171480 For source.
 * @description Hashes a string (quickly) to a 53 bit integer. This isn't secure, so it's only for use in performance
 * and non-security related tasks.
 */
export function fastHash(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 0x85ebca77);
    h2 = Math.imul(h2 ^ ch, 0xc2b2ae3d);
  }
  h1 ^= Math.imul(h1 ^ (h2 >>> 15), 0x735a2d97);
  h2 ^= Math.imul(h2 ^ (h1 >>> 15), 0xcaf649a9);
  h1 ^= h2 >>> 16;
  h2 ^= h1 >>> 16;
  return 2097152 * (h2 >>> 0) + (h1 >>> 11);
}

/**
 * @description Attempts to call `hashed.toString(length)` until the result is exactly `length`. If `input` is a string
 * then it will be hashed first with `fastHash`, otherwise it's used as is.
 * @throws Throws an Error if `length` is less than zero.
 */
export function hashWithLength(input: string | number, length: number, seed = 0): string {
  if (length < 0) throw new Error('`length` cannot be less than zero');
  const h = typeof input === 'number' ? input : fastHash(input, seed);
  const approxBaseFromLength = Math.max(Math.min(Math.pow(2, Math.ceil(Math.log2(length))), 36), 2);
  let result = h.toString(approxBaseFromLength);
  if (result.length === length) return result;
  for (let i = 1; i < length * 2; i++) {
    if (approxBaseFromLength + i > 36) continue;
    result = h.toString(approxBaseFromLength + i);
    if (result.length === length) return result;
    if (approxBaseFromLength - i < 2) continue;
    result = h.toString(approxBaseFromLength - i);
    if (result.length === length) return result;
  }
  return h.toString().padEnd(length, '0').slice(0, length);
}

/** Coerces any `input` into a string, then uses `fastHash` on it. */
export function coerceHash(input: unknown, seed = 0): number {
  if (typeof input === 'string') return fastHash(input, seed);
  if (typeof input === 'number') return fastHash(input.toString(), seed);
  if (Array.isArray(input)) return fastHash(input.map(v => coerceHash(v, seed)).join(''));
  if (isObjectLike(input)) return fastHash(JSON.stringify(sortByKeys(input)), seed);
  if (typeof input === 'bigint') return fastHash(input.toString());
  if (typeof input === 'undefined') return fastHash('undefined', seed);
  if (typeof input === 'symbol') return fastHash(input.toString(), seed);
  return fastHash(JSON.stringify(input), seed);
}

/**
 * Calls regex.exec(string) continually until there are no more matches. Differs from
 * string.match(regex) as that only returns a string array.
 * @param regex The regular expression to use on string. Must have the global flag set.
 * @param string The string to search through.
 * @throws Throws an Error if regex does not have the global flag set.
 */
export function matches(regex: RegExp, string: string): IterableIterator<RegExpExecArray> {
  if (!regex.flags.includes('g')) regex = new RegExp(regex.source, regex.flags + 'g');

  return {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      const result = regex.exec(string);
      if (!result) return { done: true, value: undefined };
      return { done: false, value: result };
    },
  };
}

/**
 * A convenient type for using the most commonly used result of `RegExp.exec` or `String.match`
 * (when not using the "g" flag). For example `'abc'.match(/a/)[0]` returns the first complete capture group string of
 * the match. This type is just that string itself, as well as having the `start`, `end` and `input` properties.
 */
export type CompleteRegExpMatch = string & {
  /** The start index of this match in `input`. */
  start: number;
  /** The end index of this match in `input`. */
  end: number;
  /** The input string that was searched. */
  input: string;
};

/**
 * @param value Result from `RegExp.exec` or `String.match`.
 * @returns The first match from the result of `RegExp.exec` or `String.match`. I.e. result[0], result.index and
 * result.input.
 */
export function toMatch(value: Nullish<RegExpExecArray | RegExpMatchArray>): Nullish<CompleteRegExpMatch> {
  if (!value || typeof value.index !== 'number' || typeof value.input !== 'string') return null;
  const str = value[0];
  return Object.assign(str, { start: value.index, end: value.index + str.length, input: value.input });
}

/**
 * Implementation of Array.splice but with strings. It's quicker than doing
 * str.split('').map(func).join('') or similar as it just uses two slice methods.
 * @param str The string to be spliced.
 * @param index The index to start the splice.
 * @param count Optional, number of characters in str to remove (default: 1).
 * @param add Optional, the string to append at index.
 */
export function stringSplice(str: string, index: number, count = 1, add = '') {
  if (index < 0 || count < 0) throw new Error('index and count parameters cannot be less than zero');

  return str.slice(0, index) + add + str.slice(index + count);
}
