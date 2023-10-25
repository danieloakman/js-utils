import { describe, it, expect } from 'bun:test';
import { range } from 'iteragain-es';
import { fastHash } from './string';

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
});
