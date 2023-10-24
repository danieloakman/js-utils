import { describe, expect, it } from 'bun:test';
import { roundTo } from '.';

describe('number', () => {
  it('roundTo', () => {
    expect(roundTo(1.2345, 2)).toBe(1.23);
    expect(roundTo(1.2345, 3)).toBe(1.235);
    expect(roundTo(1.2345, 4)).toBe(1.2345);
    expect(roundTo(1.2345, 5)).toBe(1.2345);
    expect(roundTo(1.2345, 6)).toBe(1.2345);
    expect(roundTo(1.2345, 0)).toBe(1);
  });
});
