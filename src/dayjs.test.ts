import { expect, describe, it } from 'bun:test';
import dayjs from './dayjs';

describe('dayjs', () => {
  it('plugins for dayjs work', () => {
    const yesterday = dayjs().subtract(1, 'day');
    expect(yesterday).toBeDefined();
    const year2000 = dayjs('2000-01-01');
    expect(year2000.utc()).toBeDefined();
    expect(dayjs.duration(1, 'day').asMilliseconds()).toEqual(60000 * 60 * 24);
    expect(yesterday.isBetween(year2000, dayjs())).toBeTruthy();
    expect(dayjs.min(yesterday, year2000)).toEqual(year2000);
    expect(dayjs.max(yesterday, year2000)).toEqual(yesterday);
  });
});
