import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import chalk from 'chalk';
import commander from 'commander';
import prompts from 'prompts';
import validateNpmName from 'validate-npm-package-name';
import packageJson from './package.json' assert { type: 'json' };

let projectName;

async function initAction(program) {
  if (!projectName) {
    console.error('Please specify the project directory:');
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`);
    console.log();
    console.log('For example:');
    console.log(`  ${chalk.cyan(program.name())} ${chalk.green('gopeed-test-extension')}`);
    console.log();
    console.log(`Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`);
    process.exit(1);
  }

  // check if project name is valid
  const validResult = validateNpmName(projectName);
  if (!validResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(`"${projectName}"`)} because of npm naming restrictions:`
    );

    [...(validResult.errors || []), ...(validResult.warnings || [])].forEach((error) => {
      console.error(chalk.red(`  * ${error}`));
    });
    process.exit(1);
  }

  const projectPath = path.join(process.cwd(), projectName);
  // check if target dir exists
  if (fs.existsSync(projectPath)) {
    console.error(
      `Could not create a project called ${chalk.red(`"${projectName}"`)} because this directory already exists.`
    );
    process.exit(1);
  }

  const template = await prompts([
    {
      type: 'select',
      name: 'value',
      message: 'Choose a template',
      choices: [
        { title: 'Webpack', description: 'Webpack + Eslint + Prettier', value: 'webpack' },
        { title: 'Pure', description: 'Pure Javascript', value: 'pure' },
      ],
      initial: 0,
    },
  ]);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const templatePath = path.join(__dirname, 'templates', template.value);

  // copy template files to target dir recursively
  copyDir(templatePath, projectPath);

  // print success message, and how to start the project
  console.log();
  console.log(`Success! Created ${chalk.cyan(projectName)} at ${chalk.cyan(projectPath)}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  git init`));
  console.log('    Initialize git repository');
  console.log();
  if (template.value !== 'pure') {
    console.log(chalk.cyan(`  npm install`));
    console.log('    Install dependencies');
    console.log();
    console.log(chalk.cyan(`  npm run dev`));
    console.log('    Compiles and hot-reloads for development.');
    console.log();
    console.log(chalk.cyan(`  npm run build`));
    console.log('    Compiles and minifies for production.');
    console.log();
  }
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan(`  cd ${projectName}`));
  console.log();
  console.log('Happy coding!');
}

function init() {
  const program = new commander.Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')} [options]`)
    .action((name) => {
      projectName = name;
    })
    .allowUnknownOption()
    .parse(process.argv);

  initAction(program);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  fs.readdirSync(src, { withFileTypes: true }).forEach((entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

export default init;
