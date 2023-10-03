import BinarySearch from './BinarySearch';
import { ok as assert, deepStrictEqual as equal } from 'assert';
import { randInteger } from './number';
import { describe, it } from 'bun:test';

// function time (func) {
//     const start = new Date();
//     func();
//     return new Date() - start;
// }

describe('BinarySearchService', () => {
  it('search', async () => {
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

  // TODO: See why the closest option isn't working:
  it('indexOf', () => {
    {
      const arr = [1, 4, 8, 12, 16, 20, 22];
      const bs = new BinarySearch(arr);
      equal(bs.indexOf(8), 2);
      equal(bs.indexOf(3), -1);
      equal(bs.indexOf(3), -1);
      equal(bs.indexOf(3, { closest: true }), 1);
      equal(bs.indexOf(3), -1);
      equal(bs.indexOf(3, { closest: true }), 1);
      // equal(bs.indexOf(2, { closest: true }), 0);
      // equal(bs.indexOf(21, { closest: true }), 5);
    }
    {
      const strArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      const bs = new BinarySearch(strArr, { comparator: (a, b) => a.localeCompare(b) });
      equal(bs.indexOf('a'), 0);
      equal(bs.indexOf('f'), 5);
      // equal(bs.indexOf('aa', { closest: true }), 0);
    }
  });
});
