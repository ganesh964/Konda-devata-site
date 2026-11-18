/**
 * scripts/dev.mjs
 * Starts both the gallery API server (Express/ts-node) and the Vite dev server
 * concurrently using only Node's built-in `child_process` — no extra packages needed.
 *
 * Usage: npm run dev
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const colors = {
  api: '\x1b[33m', // yellow
  vite: '\x1b[36m', // cyan
  reset: '\x1b[0m',
};

function spawnProc(label, color, cmd, args, opts = {}) {
  const proc = spawn(cmd, args, {
    cwd: root,
    shell: false,
    stdio: 'pipe',
    ...opts,
  });

  const prefix = `${color}[${label}]${colors.reset} `;

  proc.stdout?.on('data', (d) => process.stdout.write(prefix + d.toString().replace(/\n/g, `\n${prefix}`)));
  proc.stderr?.on('data', (d) => process.stderr.write(prefix + d.toString().replace(/\n/g, `\n${prefix}`)));

  proc.on('error', (err) => console.error(`${prefix}Error: ${err.message}`));
  proc.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`${prefix}exited with code ${code}`);
    }
  });

  return proc;
}

// ── 1. Gallery API (Express + ts-node) ───────────────────────────────────────
// const apiProc = spawnProc(
//   'API',
//   colors.api,
//   'node_modules/.bin/ts-node-esm',
//   [
//     '--project', 'tsconfig.server.json',
//     '--transpile-only',
//     'src/api/server.ts',
//   ]
// );
// ── 1. Gallery API (Express via npm script) ───────────────────────────────────
const apiProc = spawnProc(
  'API',
  colors.api,
  'npm',
  ['run', 'server', '--silent'], // uses the updated script above
);

// ── 2. Vite dev server ───────────────────────────────────────────────────────
const viteProc = spawnProc(
  'VITE',
  colors.vite,
  'node_modules/.bin/vite',
  []
);

// ── Graceful shutdown ────────────────────────────────────────────────────────
function shutdown() {
  apiProc.kill();
  viteProc.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
