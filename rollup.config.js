import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

// 遍历packages目录下的所有包
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const packagesDir = path.resolve(__dirname, 'packages');
const packages = fs.readdirSync(packagesDir).filter((f) => {
  // 过滤掉非文件夹
  if (!fs.statSync(path.join(packagesDir, f)).isDirectory()) {
    return false;
  }
  // 过滤掉没有package.json的文件夹
  if (!fs.existsSync(path.join(packagesDir, f, 'package.json'))) {
    return false;
  }
  // 过滤掉没有index.ts的文件夹
  if (!fs.existsSync(path.join(packagesDir, f, 'src/index.ts'))) {
    return false;
  }
  return true;
});

// 把gopeed-model包排在第一位，因为其它包依赖了model包
const modelIndex = packages.findIndex((pkgName) => pkgName === 'gopeed-model');
packages.unshift(packages.splice(modelIndex, 1)[0]);

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
