import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const distDir = resolve(root, 'dist');
const targetDir = resolve(root, 'android/app/src/main/assets/public');

if (!existsSync(distDir)) {
  console.error('dist/ fehlt. Bitte zuerst `npm run build:web` ausführen.');
  process.exit(1);
}

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(targetDir, { recursive: true });
cpSync(distDir, targetDir, { recursive: true });

console.log(`Web-Assets synchronisiert nach ${targetDir}`);
