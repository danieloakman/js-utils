import { $ } from 'bun';
import { describe, it } from 'bun:test';

import { uniqueId } from './';

async function tmpRepo() {
  const path = `./tmp/${uniqueId('js-utils-test-')}`;
  await $`mkdir ${path}}`;
  return { path };
}

describe('import', () => {
  it.todo('import dist/node', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const repo = await tmpRepo();
  });
});
