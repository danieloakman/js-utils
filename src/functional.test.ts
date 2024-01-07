import { describe, it, expect } from 'bun:test';
import { attempt, isObjectLike, multiComparator, not, once } from './functional';
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

  it('multiComparator', () => {
    const arr = [3, 5, 2, 1, 4];
    expect(arr.toSorted(multiComparator((a, b) => a - b))).toStrictEqual([1, 2, 3, 4, 5]);
    expect(arr.toSorted(multiComparator((a, b) => b - a))).toStrictEqual([5, 4, 3, 2, 1]);
    interface Foo {
      bar: number;
    }
    const comp = not(
      multiComparator<Foo, boolean>(
        (a, b) => !(isObjectLike(a) && isObjectLike(b)),
        (a, b) => !('bar' in a && 'bar' in b),
        (a, b) => !(a.bar === b.bar),
      ),
    );
    expect(comp({ bar: 1 }, { bar: 2 })).toBeFalse();
    expect(comp({ bar: 1 }, { bar: 1 })).toBeTrue();
  });
});
