import { describe, it, expect } from 'bun:test';
import { expectType, isPartiallyLike, propIs, sortByKeys, findItemsFrom } from '.';

describe('object', () => {
  it('propIs', async () => {
    const unknown: unknown = {};
    if (propIs(unknown, 'a', 'string')) expectType<string>(unknown.a);
    if (propIs(unknown, 'b', 'number')) expectType<number>(unknown.b);
    if (propIs(unknown, 'c', 'boolean')) expectType<boolean>(unknown.c);
    if (propIs(unknown, 'd', 'bigint')) expectType<bigint>(unknown.d);
    if (propIs(unknown, 'e', 'symbol')) expectType<symbol>(unknown.e);
    if (propIs(unknown, 'f', 'undefined')) expectType<undefined>(unknown.f);
    if (propIs(unknown, 'g', 'object')) expectType<object>(unknown.g);
    if (propIs(unknown, 'h', 'function')) expectType<() => any>(unknown.h);
    if (propIs(unknown, 'i', 'null')) expectType<null>(unknown.i);
    if (propIs(unknown, 'j', 'record')) expectType<Record<PropertyKey, unknown>>(unknown.j);
    if (propIs(unknown, 'k', 'array')) expectType<unknown[]>(unknown.k);
    if (propIs(unknown, 'a.b', 'string')) expectType<string>(unknown.a.b);
    if (propIs(unknown, 'a.b.c.d.e.f.g.h.i.j.k', 'string')) expectType<string>(unknown.a.b.c.d.e.f.g.h.i.j.k);
    const obj = { a: { b: [{ c: 'hi' }] } };
    expect(propIs(obj, 'a.b.0.c', 'string')).toBeTrue();
  });

  it('sortKeys', () => {
    const test = <T extends Record<string, unknown>>(actual: T, expected: T) =>
      expect(sortByKeys(actual)).toStrictEqual(expected);
    test({}, {});
    test({ a: 1 }, { a: 1 });
    test({ b: 1, a: 2 }, { a: 2, b: 1 });
    test({ b: 1, a: 2, c: 3 }, { a: 2, b: 1, c: 3 });
    test({ a: { b: 2, a: 1 } }, { a: { a: 1, b: 2 } });
  });

  it('objectIsLike', () => {
    const yes = ((a: any, b: any) => {
      const is = isPartiallyLike(a, b);
      expect(is).toBeTrue();
      return is;
    }) as typeof isPartiallyLike;
    const no = (a: any, b: any) => expect(isPartiallyLike(a, b)).toBeFalse();

    yes({}, {});
    yes({ a: 1 }, { a: 1 });
    yes({ a: 1 }, { a: 1, b: 2 });
    yes({ a: 1, b: 2 }, { a: 1 });
    {
      const a: unknown = { a: 1, b: 2 };
      const b = { a: 1 };
      if (isPartiallyLike(a, b)) expectType<{ a?: number }>(a);
    }
    yes([], []);
    yes([1], [1]);
    no([1], [1, 2]);
    no([1, 2], [1]);
    no({}, { a: 1 });
    no({ a: 1 }, {});
    no({ a: 1 }, { a: 2 });
    yes({ a: [1] }, { a: [1] });
    no({ a: [1] }, { a: [1, 2] });
  });

  it('findItemsFrom', () => {
    const yes = (a: any[], b: any[], expected: [unknown[], unknown[]]) => {
      expect(findItemsFrom(a, b)).toStrictEqual(expected as any);
    };
    yes([{ a: 1 }], [{ a: 1 }], [[{ a: 1 }], []]);
    yes([{ a: 1 }], [{ a: 1, b: 2 }], [[{ a: 1, b: 2 }], []]);
    yes([{ b: 2 }], [{ a: 1 }], [[], [{ a: 1 }]]);
    yes([{ a: 1 }], [{ a: 2 }], [[], [{ a: 2 }]]);
    yes([{}], [{}], [[{}], []]);
    interface Item {
      id: string;
      n: number;
      children?: Item[];
    }
    const o = (id: number | string, children: Item[] = []): Item => ({ id: id.toString(), n: parseInt(id.toString()), children });
    yes([o(1)], [o(1)], [[o(1)], []]);
    yes([o(1)], [o(1), o(2)], [[o(1)], [o(2)]]);
    yes([o(1, [o(2)])], [o(1, [o(2)])], [[o(1, [o(2)])], []]);
  });
});
