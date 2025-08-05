import { describe, it, expect } from 'bun:test';
import { Deferral, deferral } from './disposables';
import { sleep } from 'bun';

describe('disposables', () => {
  it('async deferral', async () => {
    const logs: number[] = [];
    {
      await using defer = deferral();
      defer(() => sleep(20).then(() => logs.push(2)));
      defer(() => sleep(10).then(() => logs.push(1)));
      defer(() => sleep(30).then(() => logs.push(3)));
      expect(logs.length).toBe(0);
    }
    expect(logs).toStrictEqual([1, 2, 3]);
  });

  it('async Deferral class', async () => {
    const logs: number[] = [];
    {
      await using defer = new Deferral();
      defer.add(() => sleep(20).then(() => logs.push(2)));
      defer.add(() => sleep(10).then(() => logs.push(1)));
      defer.add(() => sleep(30).then(() => logs.push(3)));
      expect(logs.length).toBe(0);
    }
    expect(logs).toStrictEqual([1, 2, 3]);
  });

  it('sync deferral', async () => {
    const logs: number[] = [];
    {
      using defer = deferral();
      defer(() => logs.push(1));
      defer(() => logs.push(2));
      defer(() => logs.push(3));
      expect(logs.length).toBe(0);
    }
    expect(logs).toStrictEqual([1, 2, 3]);
  });

  it('sync Deferral class', async () => {
    const logs: number[] = [];
    {
      using defer = new Deferral();
      defer.add(() => logs.push(1));
      defer.add(() => logs.push(2));
      defer.add(() => logs.push(3));
      expect(logs.length).toBe(0);
    }
    expect(logs).toStrictEqual([1, 2, 3]);
  });

  it("sync deferral doesn't await", async () => {
    const logs: number[] = [];
    {
      // Purposely not using the `await using` syntax:
      using defer = deferral();
      defer(() => sleep(20).then(() => logs.push(1)));
    }
    expect(logs.length).toBe(0); // Did not await the deferred function as it was not awaited on.
    await sleep(30);
    expect(logs).toStrictEqual([1]);
  });
});
