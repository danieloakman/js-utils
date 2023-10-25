import { exec, ok, sh } from '../src';
import { clean } from './clean';
import { CompileArgs, compile } from './compile';

async function main() {
  if (!ok(await exec('git status')).includes('On branch main')) throw new Error('Not on main branch.');

  const argsList: CompileArgs[] = [
    { target: 'node', format: 'cjs' },
    { target: 'browser', format: 'esm' },
    { target: 'bun', format: 'esm' },
  ];
  try {
    for (const args of argsList) {
      console.log('🚀 Compiling for', args.target, args.format);
      if (!ok(await exec('git status')).includes('nothing to commit'))
        throw new Error('Did not have a clean working directory.');
      ok(await sh(`git checkout ${args.target} && git pull && git merge origin/main -X theirs && git push `));
      ok(await compile(args));
      if (ok(await exec('git status')).includes('nothing to commit')) {
        console.log(`No changes to commit for ${args.target}, skipping...`);
        continue;
      }
      ok(await sh(`git add . && git commit -m "chore: compiled for ${args.target} ${args.format}" && git push`));
    }
  } finally {
    await sh('git checkout main');
    await clean();
  }
}

if (Bun.main === import.meta.path) main();
