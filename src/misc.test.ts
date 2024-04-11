import { assert, exec, ok, sh } from '.';
import { describe, it } from 'bun:test';
import { readFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

describe('misc', () => {
  it('exec', async () => {
    assert(ok(await exec('echo "hello world"')).includes('world'));
    assert(/\d+\.\d+\.\d+/.test(ok(await exec('bun -v'))));
  });

  it('sh', async () => {
    const tmpfile = join(tmpdir(), 'bun-test-sh.txt');
    ok(await sh(`touch ${tmpfile}`));
    ok(await sh(`echo "hello world" > ${tmpfile}`));
    assert((await readFile(tmpfile, 'utf-8')).includes('world'));
    ok(await sh(`rm ${tmpfile}`));
    ok(await sh('echo hi', 'echo there', 'echo world!'));
  });
});
