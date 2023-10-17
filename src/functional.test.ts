import { describe, it, expect } from 'bun:test';
import { attempt, once } from './functional';
import { sleep } from 'bun';
import { expectType } from '.';

describe('functional', () => {
  it('attempt', async () => {
    {
      const fn = (n: number) => {
        if (n > 1) throw new Error('n > 1');
        return n;
      };
      expect(attempt(fn, 1)).toBe(1);
      expect(attempt(fn, 2)).toBeInstanceOf(Error);
    }
    {
      const fn = async (n: number) => {
        await sleep(n);
        if (n > 1) throw new Error('n > 1');
        return n;
      };
      expect(await attempt(fn, 1).then(expectType<number | Error>)).toBe(1);
      expect(await attempt(fn, 2).then(expectType<number | Error>)).toBeInstanceOf(Error);
    }
  });

  it('once', async () => {
    let called = 0;
    const factorial = once((n: number, t: number) => {
      called++;
      let result = n;
      for (let i = 0; i < t; i++) result *= n;
      return result;
    });
    expect(factorial(2, 2)).toBe(8);
    expect(called).toBe(1);
    expect(factorial(2, 2)).toBe(8);
    expect(called).toBe(1);
  });
});
