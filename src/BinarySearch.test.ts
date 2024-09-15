import { expectType } from '.';
import { ok as assert, deepStrictEqual as equal } from 'assert';
import { describe, it } from 'bun:test';
import { forEach, shuffle } from 'iteragain';

import BinarySearch from './BinarySearch';
import { pipe } from './functional';
import { randInteger } from './number';

// function time (func) {
//     const start = new Date();
//     func();
//     return new Date() - start;
// }

describe('BinarySearchService', () => {
  it('has', async () => {
    const ascArr = new Array(1e3 / 4)
      .fill(1)
      .map(_ => randInteger(1, 1e3 - 1))
      .sort((a, b) => a - b);
    let bs = new BinarySearch(ascArr);

    ascArr.forEach(num => assert(bs.has(num)));
    [0, 1e3].forEach(num => assert(!bs.has(num)));

    const descArr = ascArr.reverse();
    bs = new BinarySearch(descArr, { comparator: (a, b) => b - a });
    descArr.forEach(num => bs.has(num));
    ascArr.forEach(num => assert(bs.has(num), `Could not find ${num}`));
    [0, 1e3].forEach(num => assert(!bs.has(num)));

    bs = new BinarySearch([1, 5]);
    assert(bs.has(1) && bs.has(5));
  });

  it('indexOf & closestIndexOf', () => {
    {
      const arr = [1, 4, 8, 12, 16, 20, 22];
      const bs = new BinarySearch(arr);
      equal(bs.indexOf(8), 2);
      equal(bs.indexOf(3), -1);
      equal(bs.indexOf(3), -1);
      equal(bs.closestIndexOf(3), 1);
      equal(bs.indexOf(3), -1);
      equal(bs.closestIndexOf(3), 1);
      equal(bs.closestIndexOf(2), 0);
      equal(bs.closestIndexOf(21), 5);
    }
    {
      const strArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      const bs = new BinarySearch(strArr, { comparator: (a, b) => a.localeCompare(b) });
      equal(bs.indexOf('a'), 0);
      equal(bs.indexOf('f'), 5);
      equal(bs.closestIndexOf('aa'), 0);
      pipe(
        strArr,
        shuffle,
        expectType<IterableIterator<string>>,
        forEach(str => equal(bs.at(bs.indexOf(str)), str)),
      );
    }
  });

  it('insert', () => {
    const bs = new BinarySearch([1, 5, 9, 13, 17, 21, 25]);
    bs.insert(2);
    equal(bs.indexOf(2), 1);
    bs.insert(3);
    equal(bs.indexOf(3), 2);
    bs.insert(4);
    equal(bs.indexOf(4), 3);
    bs.insert(6);
    equal(bs.indexOf(6), 5);
    bs.insert(7);
    equal(bs.indexOf(7), 6);
    bs.insert(25);
    equal(bs.indexOf(25), 11);
  });
});
