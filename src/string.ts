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
