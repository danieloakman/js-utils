import toIterator from 'iteragain/toIterator';

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
  return toIterator(() => regex.exec(string), null);
}
