import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

// foreach packages
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const packagesDir = path.resolve(__dirname, 'packages');
const packages = fs.readdirSync(packagesDir).filter((f) => {
  if (!fs.statSync(path.join(packagesDir, f)).isDirectory()) {
    return false;
  }
  if (!fs.existsSync(path.join(packagesDir, f, 'package.json'))) {
    return false;
  }
  if (!fs.existsSync(path.join(packagesDir, f, 'src/index.ts'))) {
    return false;
  }
  return true;
});

export default packages.map((pkgName) => {
  const pkg = JSON.parse(fs.readFileSync(path.join(packagesDir, pkgName, 'package.json'), 'utf-8'));
  return {
    input: `packages/${pkgName}/src/index.ts`,
    output: [
      {
        file: `packages/${pkgName}/dist/index.cjs`,
        format: 'cjs',
        sourcemap: false,
      },
      {
        file: `packages/${pkgName}/dist/index.js`,
        format: 'esm',
        sourcemap: false,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
          },
          include: [`packages/${pkgName}/src`],
        },
      }),
    ],
    external: Object.keys(pkg.dependencies || {}),
  };
});
