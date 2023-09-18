import { describe, it } from 'bun:test';
import { sh, assert, ok } from '.';

describe('misc', () => {
  it('sh', async () => {
    assert(ok(await sh('echo "hello world"', { log: false })).includes('world'));
    assert(/\d+\.\d+\.\d+/.test(ok(await sh('bun -v'))));
  });
});
