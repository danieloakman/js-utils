import { Nullish, expectType, randInteger } from '.';
import { describe, expect, it } from 'bun:test';

import {
  addTimeout,
  attempt,
  flow,
  isError,
  isObjectLike,
  memoize,
  multiComparator,
  not,
  once,
  raise,
  safeCall,
  sleep,
  toAsyncFn,
  tryResult,
  classToFn,
  limitConcurrency,
  callConcurrently,
} from './functional';
import Result from './result';
import { stat } from 'fs/promises';

describe('functional', () => {
  it('attempt', async () => {
    {
      const fn = (n: number) => {
        if (n > 1) throw new Error('n > 1');
        return n;
      };
      expect(attempt(fn, 1)).toStrictEqual(Result.Ok(1));
      expect(attempt(fn, 2).error).toBeInstanceOf(Error);
    }
    {
      const fn = async (n: number) => {
        await sleep(n);
        if (n > 1) throw new Error('n > 1');
        return n;
      };
      expect(await attempt(fn, 1).then(expectType<Result<number>>)).toStrictEqual(Result.Ok(1));
      expect(
        await attempt(fn, 2)
          .then(expectType<Result<number>>)
          .then(e => e.error),
      ).toBeInstanceOf(Error);
    }
    {
      class A {
        constructor(public n: number) {}
        fn() {
          if (this.n > 1) throw new Error('n > 1');
          return this.n;
        }
      }
      const a = new A(0);
      expect(attempt(a.fn.bind(a) as () => number)).toStrictEqual(Result.Ok(0));
      a.n = 2;
      expect(attempt(a.fn.bind(a) as () => number).error).toBeInstanceOf(Error);
    }
    {
      const e = attempt(() => {
        throw new Error('error');
      });
      expect(e.error).toBeInstanceOf(Error);
    }
    {
      expect(await attempt(Promise.resolve(1))).toStrictEqual(Result.Ok(1));
      expect(await attempt(Promise.reject(new Error('error'))).then(e => e.error)).toBeInstanceOf(Error);
    }
    {
      // @ts-expect-error Cannot pass an error to `attempt`
      expect(() => attempt(new Error('error'))).toThrow();
    }
    {
      const { data: stats, error } = await attempt(stat(import.meta.dirname));
      expect(error).toBeUndefined();
      expect(stats?.isDirectory()).toBe(true);
      expect(stats?.isFile()).toBe(false);
    }
  });

  it('safeCall', async () => {
    const fnSync = (n: number) => {
      if (n > 1) throw new Error('n > 1');
      return n;
    };
    expect(safeCall(fnSync, 1)).toBe(1);
    expect(safeCall(fnSync, 2)).toBeNull();

    const fnAsync = async (n: number) => {
      await sleep(n);
      if (n > 1) throw new Error('n > 1');
      return n;
    };
    expect(await safeCall(fnAsync, 1)).toBe(1);
    expect(await safeCall(fnAsync, 2)).toBeNull();
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

  it('once async', async () => {
    let called = 0;
    const sleepOnce = once(async (ms: number) => {
      called++;
      return sleep(ms);
    });
    await Promise.all(Array.from({ length: randInteger(2, 100) }, () => sleepOnce(1)));
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

    const e = attempt(() => raise(new Error('1'), new Error('2')));
    expect(e.error).toBeInstanceOf(Error);

    // @ts-expect-error
    const e2 = attempt(() => raise('1', '2'));
    expect(e2.error).toBeInstanceOf(Error);
  });

  it('tryResult', async () => {
    const fnSync = tryResult((n: number) => (n > 1 ? raise('n > 1') : n));
    expect(fnSync(1)).toStrictEqual(Result.Ok(1));
    expect(fnSync(2).error).toBeInstanceOf(Error);

    const fnAsync = tryResult(async (n: number) => {
      await sleep(n);
      if (n > 1) throw new Error('n > 1');
      return n;
    });
    expect(await fnAsync(1)).toStrictEqual(Result.Ok(1));
    expect(await fnAsync(2).then(e => e.error)).toBeInstanceOf(Error);
  });

  it('addTimeout', async () => {
    const fn = addTimeout(sleep, 100);
    expect(await fn(1)).toStrictEqual(Result.Ok(1));
    expect(await fn(50)).toStrictEqual(Result.Ok(50));
    expect(await fn(200).then(e => e.error)).toBeInstanceOf(Error);
  });

  it('classToFn', () => {
    class A {
      constructor(public n: number) {}
    }
    const a = classToFn(A);
    expect(a(1)).toBeInstanceOf(A);
    expect(a(1).n).toBe(1);
  });

  it('limitConcurrency', async () => {
    const fn = limitConcurrency(sleep, 1);
    const start = Date.now();
    await Promise.all([fn(100), fn(100), fn(100)]);
    expect(Date.now() - start).toBeGreaterThanOrEqual(300);

    // Test successful execution
    expect(await fn(1)).toStrictEqual(1);
    expect(await fn(50)).toStrictEqual(50);
  });

  it('callConcurrently', async () => {
    const nums = function* (start: number, end: number) {
      for (let i = start; i < end; i++) yield () => sleep(i);
    };
    const result = await callConcurrently(nums(0, 5), Infinity);
    expect(result).toEqual([0, 1, 2, 3, 4]);
    const start = Date.now();
    await callConcurrently(nums(100, 105), 1);
    expect(Date.now() - start).toBeGreaterThan(500);
  });
});
