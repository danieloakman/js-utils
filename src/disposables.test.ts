import { describe, it, expect } from 'bun:test';
import { deferral } from './disposables';
import { sleep } from 'bun';

describe('disposables', () => {
  it('deferral', async () => {
    const logs: number[] = [];
    {
      await using defer = deferral();
      defer(() => sleep(20).then(() => logs.push(2)));
      defer(() => sleep(10).then(() => logs.push(1)));
      defer(() => sleep(30).then(() => logs.push(3)));
    }
    expect(logs).toStrictEqual([1, 2, 3]);
  });
});
