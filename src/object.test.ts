import { describe, it, expect } from 'bun:test';
import { expectType, propIs, sortByKeys } from '.';

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
});
