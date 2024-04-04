#! bun
/** Brute force way to make sure all compiled ts files are removed. `tsc --build --clean` didn't always work as intended. */

import { walkdir } from 'more-node-fs';
import { unlinkSync as unlink } from 'fs';
import { join } from 'path';

export async function clean() {
  for await (const { path, stats } of walkdir(join(import.meta.dir, '../'), { ignore: /node_modules/i }))
    if (stats.isFile() && /(\.d\.ts|\.js|\.map)$/.test(path)) unlink(path);
}

if (import.meta.main) clean();
