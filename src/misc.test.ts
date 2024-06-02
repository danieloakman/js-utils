import { assert, exec, execSync, ok, pipe, sh } from '.';
import { describe, expect, it } from 'bun:test';
import { readFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

describe('misc', () => {
  it('exec', async () => {
    assert(ok(await exec('echo "hello world"')).includes('world'));
    assert(/\d+\.\d+\.\d+/.test(ok(await exec('bun -v'))));
    process.env.SOME_VAR = 'some_value';
    assert(ok(await exec('echo $SOME_VAR')).includes('some_value'));
  });

  it('sh', async () => {
    const tmpfile = join(tmpdir(), 'bun-test-sh.txt');
    ok(await sh(`touch ${tmpfile}`));
    ok(await sh(`echo "hello world" > ${tmpfile}`));
    assert((await readFile(tmpfile, 'utf-8')).includes('world'));
    ok(await sh(`rm ${tmpfile}`));
    ok(await sh('echo hi', 'echo there', 'echo world!'));
  });

  it('execSync', () => {
    expect(pipe(execSync('echo "hello_world"'), ok)).toInclude('hello_world');
    expect(pipe(execSync('bun -v'), ok)).toMatch(/\d+\.\d+\.\d+/);
    expect(pipe(execSync('echo $SHELL'), ok)).toInclude(process.env.SHELL!);
    expect(execSync('a_command_that_does_not_exist')).toBeInstanceOf(Error);
    process.env.SOME_VAR = 'some_value';
    expect(pipe(execSync('echo $SOME_VAR'), ok)).toInclude('some_value');
  });
});
