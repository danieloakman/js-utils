import { FSPath, fspath } from './FSPath';
import { describe, it, expect } from 'bun:test';

describe('FSPath', () => {
  it('constructor', () => {
    const f = fspath('a', 'b', 'c');
    expect(f).toBeInstanceOf(FSPath);
    expect(f.toString()).toBe('a/b/c');
    expect(f.shift().pop().full()).toBe('b');
  });
});
