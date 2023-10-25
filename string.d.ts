import { Nullish } from './types';
/**
 * @see https://stackoverflow.com/a/52171480 For source.
 * @description Hashes a string (quickly) to a 53 bit integer. This isn't secure, so it's only for use in performance
 * and non-security related tasks.
 */
export declare function fastHash(str: string, seed?: number): number;
/**
 * @description Attempts to call `hashed.toString(length)` until the result is exactly `length`. If `input` is a string
 * then it will be hashed first with `fastHash`, otherwise it's used as is.
 * @throws Throws an Error if `length` is less than zero.
 */
export declare function hashWithLength(input: string | number, length: number): string;
/**
 * Calls regex.exec(string) continually until there are no more matches. Differs from
 * string.match(regex) as that only returns a string array.
 * @param regex The regular expression to use on string. Must have the global flag set.
 * @param string The string to search through.
 * @throws Throws an Error if regex does not have the global flag set.
 */
export declare function matches(regex: RegExp, string: string): IterableIterator<RegExpExecArray>;
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
export declare function toMatch(value: Nullish<RegExpExecArray | RegExpMatchArray>): Nullish<CompleteRegExpMatch>;
/**
 * Implementation of Array.splice but with strings. It's quicker than doing
 * str.split('').map(func).join('') or similar as it just uses two slice methods.
 * @param str The string to be spliced.
 * @param index The index to start the splice.
 * @param count Optional, number of characters in str to remove (default: 1).
 * @param add Optional, the string to append at index.
 */
export declare function stringSplice(str: string, index: number, count?: number, add?: string): string;
