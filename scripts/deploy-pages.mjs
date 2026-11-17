// Publishes the built demo in dist/ to the repo's gh-pages branch, which
// GitHub Pages serves at
// https://rolandvtonder.github.io/PINNACLE-POINT-ESTATE-ACCOMMODATION-website-demo/
// Run with `npm run deploy` (it builds first). The branch only ever holds the
// latest build, so it is replaced on each deploy.
//
// GitHub Pages can't run PHP, so on the demo the calendar shows every date as
// free. The real site goes to Afrihost with `npm run build`.
import {execFileSync} from 'node:child_process';
import {existsSync, rmSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
if (!existsSync(resolve(dist, 'index.html'))) {
  console.error('dist/ is empty: run `npm run build:pages` first.');
  process.exit(1);
}

const git = (cwd, ...args) => execFileSync('git', args, {cwd, stdio: 'inherit'});
const remote = execFileSync('git', ['remote', 'get-url', 'origin'], {cwd: root}).toString().trim();

// Serve files as-is (no Jekyll processing).
writeFileSync(resolve(dist, '.nojekyll'), '');
rmSync(resolve(dist, '.git'), {recursive: true, force: true});
git(dist, 'init', '-q', '-b', 'gh-pages');
git(dist, 'add', '-A');
git(dist, 'commit', '-q', '-m', `Deploy ${new Date().toISOString()}`);
git(dist, 'push', '-f', remote, 'gh-pages');

// Put the page heads back to the real-domain version for the source tree.
execFileSync('node', ['scripts/pages.mjs'], {cwd: root, stdio: 'inherit'});
console.log('\nPublished. Live in a minute or two at https://rolandvtonder.github.io/PINNACLE-POINT-ESTATE-ACCOMMODATION-website-demo/');
