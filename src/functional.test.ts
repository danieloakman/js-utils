import { Nullish, expectType } from '.';
import { describe, expect, it } from 'bun:test';

import {
  attempt,
  flow,
  isError,
  isObjectLike,
  memoize,
  multiComparator,
  not,
  once,
  raise,
  sleep,
  toAsyncFn,
} from './functional';

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

  it('memoize', async () => {
    {
      const cache = new Map<string, number>();
      const factorial = memoize(
        (n: number, t: number) => {
          let result = n;
          for (let i = 0; i < t; i++) result *= n;
          return result;
        },
        { cache },
      );
      expect([factorial(10, 10), factorial(10, 10)]).toEqual([100000000000, 100000000000]);
      expect(cache.size).toBe(1);
    }
    {
      const cache = new Map<string, Promise<number>>();
      const memSleep = memoize(sleep, { cache });
      expect([await memSleep(1), await memSleep(1)]).toEqual([1, 1]);
      expect(cache.size).toBe(1);
    }
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

  it('flow', () => {
    const fn = flow(
      (v: number) => v.toString(),
      v => v + '0',
      v => parseFloat(v),
    );
    expect(fn(1)).toBe(10);
    expect(fn(2)).toBe(20);
  });

  it('toAsyncFn', async () => {
    {
      const fn = toAsyncFn((n: number) => {
        const result = n * 2;
        if (result > 100) throw new Error('result > 100');
        return result;
      });
      expect(await fn(1)).toBe(2);
      fn(2)
        .then(expectType<number>)
        .then(v => expect(v).toBe(4));
      expect(await fn(51).catch(() => 'err')).toBe('err');
      let finallyWasCalled = false;
      expect(await fn(40).finally(() => (finallyWasCalled = true))).toBe(80);
      expect(finallyWasCalled).toBeTrue();
    }
    {
      class A {
        constructor(public n: number) {}
        async fn() {
          return this.n * 2;
        }
      }
      const a = new A(5);
      const fn = toAsyncFn(a.fn.bind(a));
      expect(await fn()).toBe(10);
    }
    {
      const s = toAsyncFn(sleep);
      expect(await s(1)).toBe(1);
      s(2)
        .then(expectType<number>)
        .then(v => expect(v).toBe(2));
    }
  });

  it('isError', () => {
    expect(isError(new Error())).toBeTrue();
    expect(isError(new TypeError())).toBeTrue();
    expect(isError(new SyntaxError())).toBeTrue();
    expect(isError(new RangeError())).toBeTrue();
    expect(isError(new URIError())).toBeTrue();
    expect(isError(new EvalError())).toBeTrue();
    expect(isError(new ReferenceError())).toBeTrue();
    expect(isError(new EvalError())).toBeTrue();
    expect(isError(new Error('error'))).toBeTrue();
  });

  it('raise', async () => {
    const fn = (n: Nullish<number>) => ((n ?? raise('n is nullish')) > 10 ? raise(`${n} > 10`) : n);
    expect(() => fn(11)).toThrow();
    expect(() => fn(10)).not.toThrow();
    expect(() => fn(null)).toThrow();
    expect(() => fn(undefined)).toThrow();
  });

  // it('tryCatch', async () => {
  //   {
  //     let finCalled = false;
  //     const fn = tryCatch(
  //       (n: number): number => {
  //         if (n > 1) throw new Error('n > 1');
  //         return n;
  //       },
  //       { then: n => n * 2, err: () => 'err', fin: () => (finCalled = true) },
  //     );
  //     expect(fn(1)).toBe(2);
  //     expect(fn(2)).toBe('err');
  //     expect(fn(-1)).toBe(-2);
  //     expect(finCalled).toBeTrue();
  //   }
  //   {
  //     let finCalled = false;
  //     const fn = tryCatch(
  //       async (n: number) => {
  //         await sleep(n);
  //         if (n > 1) throw new Error('n > 1');
  //         return n;
  //       },
  //       { then: n => n * 2, err: () => 'err', fin: () => (finCalled = true) },
  //     );
  //     expect(await fn(1)).toBe(2);
  //     expect(finCalled).toBeTrue();
  //   }
  // });
});
