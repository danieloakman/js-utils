import { manhattanDistance, roundTo } from '.';
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
});
