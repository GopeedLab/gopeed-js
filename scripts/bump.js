#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf-8'));
}

function writeJson(file, data) {
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

function bumpVersion(version, type) {
  const [major, minor, patch] = version.split('.').map(Number);
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
  }
}

const packagePaths = [
  'package.json',
  'packages/gopeed-types/package.json',
  'packages/gopeed-rest/package.json',
  'packages/gopeed/package.json',
  'packages/create-gopeed-ext/package.json',
];

const rootPkg = readJson(resolve(root, 'package.json'));
const current = rootPkg.version;

const choices = ['patch', 'minor', 'major'];
const previews = choices.map((t) => `${t} (${current} → ${bumpVersion(current, t)})`);

// ANSI helpers
const ESC = '\x1b';
const up = `${ESC}[A`;
const clear = `${ESC}[2K\r`;
const cyan = (s) => `${ESC}[36m${s}${ESC}[0m`;
const dim = (s) => `${ESC}[2m${s}${ESC}[0m`;

function render(selected) {
  previews.forEach((label, i) => {
    const prefix = i === selected ? cyan('❯ ') : '  ';
    process.stdout.write(`${clear}${prefix}${i === selected ? label : dim(label)}\n`);
  });
}

function moveUp(n) {
  process.stdout.write(`${ESC}[${n}A`);
}

let selected = 0;

process.stdout.write(`\nSelect bump type for ${cyan(current)}:\n\n`);
render(selected);

const rl = readline.createInterface({ input: process.stdin });
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (_, key) => {
  if (!key) return;

  if (key.name === 'up') {
    selected = (selected - 1 + choices.length) % choices.length;
    moveUp(choices.length);
    render(selected);
  } else if (key.name === 'down') {
    selected = (selected + 1) % choices.length;
    moveUp(choices.length);
    render(selected);
  } else if (key.name === 'return') {
    process.stdin.setRawMode(false);
    rl.close();

    const type = choices[selected];
    const newVersion = bumpVersion(current, type);

    process.stdout.write('\n');
    console.log(`Bumping ${current} → ${newVersion} (${type})\n`);

    for (const rel of packagePaths) {
      const file = resolve(root, rel);
      const pkg = readJson(file);
      pkg.version = newVersion;
      writeJson(file, pkg);
      console.log(`  updated ${rel}`);
    }

    const templateFile = resolve(root, 'packages/create-gopeed-ext/templates/webpack/package.json');
    const tpl = readJson(templateFile);
    tpl.devDependencies.gopeed = `^${newVersion}`;
    writeJson(templateFile, tpl);
    console.log(`  updated packages/create-gopeed-ext/templates/webpack/package.json`);

    console.log(`\nDone. New version: ${newVersion}`);
  } else if (key.name === 'escape' || (key.ctrl && key.name === 'c')) {
    process.stdin.setRawMode(false);
    rl.close();
    console.log('\nCancelled.');
    process.exit(0);
  }
});
