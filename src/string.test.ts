import { describe, it, expect } from 'bun:test';
import { iter, range } from 'iteragain-es';
import { fastHash, hashWithLength } from './string';
import { randInteger } from '.';

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
});
