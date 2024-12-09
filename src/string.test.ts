import { randInteger } from '.';
import { describe, expect, it } from 'bun:test';
import { iter, range } from 'iteragain';

import { coerceHash, fastHash, hashWithLength, txt, uniqueId } from './string';

describe('string', () => {
  it('fastHash', () => {
    const h = fastHash('hello world');
    expect(h.toString(2)).toHaveLength(53);
    let length = Infinity;
    for (const n of range(2, 37)) {
      const str = h.toString(n);
      expect(str.length).toBeLessThanOrEqual(length);
      length = str.length;
      // console.log(str, str.length, n);
    }
    expect(fastHash(JSON.stringify(null)));
  });

  it('hashWithLength', () => {
    const test = (str: string, length: number) => {
      const h = hashWithLength(str, length);
      expect(h).toHaveLength(length);
    };
    const randStr = (length: number) =>
      iter(range(length))
        .map(() => String.fromCharCode(randInteger(32, 126)))
        .join('') ?? '';
    iter(range(0, 1000))
      .map(n => [n, randStr(n)] as const)
      .forEach(([n, str]) => test(str, n));
  });

  it('coerceHash', () => {
    const yes = (input: unknown, expected: number) => expect(coerceHash(input)).toBe(expected);
    yes('hello world', fastHash('hello world'));
    yes(123, fastHash('123'));
    yes(123n, fastHash('123'));
    yes(true, fastHash('true'));
    yes(false, fastHash('false'));
    yes(null, fastHash('null'));
    yes(undefined, fastHash('undefined'));
    yes(Symbol('hello'), fastHash('Symbol(hello)'));
    yes(Symbol.for('hello'), fastHash('Symbol(hello)'));
    yes(Symbol.iterator, fastHash('Symbol(Symbol.iterator)'));
    yes({ a: 1 }, fastHash(JSON.stringify({ a: 1 })));
    expect(coerceHash([1, 2, 3])).toBeGreaterThan(10000);
  });

  it('uniqueId', () => {
    expect(uniqueId()).toBe('0');
    expect(uniqueId()).toBe('1');
    expect(uniqueId('test-')).toBe('test-0');
  });

  it('txt', () => {
    expect(txt`asd ${1}`).toBe('asd 1');
    expect(txt`asd ${1}
    asd ${2}`).toBe('asd 1\nasd 2');
    expect(txt`
    something:
      1: 1
      2: 2
    `).toBe(`something:\n1: 1\n2: 2`);
  });
});
