import { manhattanDistance, roundTo, roundToNearest } from '.';
import { describe, expect, it } from 'bun:test';

describe('number', () => {
  it('roundTo', () => {
    expect(roundTo(1.2345, 2)).toBe(1.23);
    expect(roundTo(1.2345, 3)).toBe(1.235);
    expect(roundTo(1.2345, 4)).toBe(1.2345);
    expect(roundTo(1.2345, 5)).toBe(1.2345);
    expect(roundTo(1.2345, 6)).toBe(1.2345);
    expect(roundTo(1.2345, 0)).toBe(1);
  });

  it('manhattanDistance', () => {
    expect(manhattanDistance([1, 2, 3], [1, 2, 3])).toBe(0);
    expect(manhattanDistance([1, 2, 3], [1, 2, 4])).toBe(1);
    expect(manhattanDistance([1, 2, 3], [1, 2, 2])).toBe(1);
    expect(manhattanDistance([1, 2, 3], [1, 1, 3])).toBe(1);
  });

  it('roundToNearest', () => {
    expect(roundToNearest(1.2345, 0.1)).toBe(1.2);
    expect(roundToNearest(1.2345, 0.01)).toBe(1.23);
    expect(roundToNearest(1.2345, 0.001)).toBe(1.235);
    expect(roundToNearest(1.2345, 0.0001)).toBe(1.2345);
    expect(roundToNearest(1.2345, 0.00001)).toBe(1.2345);
    expect(roundToNearest(50, 30)).toBe(60);
    expect(roundToNearest(100, 30)).toBe(90);
    expect(roundToNearest(100, 99)).toBe(99);
    expect(roundToNearest(100, 2)).toBe(100);
  });
});
