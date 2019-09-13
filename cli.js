#!/usr/bin/env node

const fs = require('fs');
const { spawn } = require('child_process');
const { promisify } = require('util');
const inquirer = require('inquirer');
const prettier = require('prettier');
const ora = require('ora');
const { defaults, questions } = require('./config');
const { installDev } = require('./install-dependencies');
const writeFile = promisify(fs.writeFile);

const format = (filename, contents, prettierConfig) => {
	const isJS = filename.endsWith('.js');
	return prettier.format(`${isJS ? 'module.exports = ' : ''}${JSON.stringify(contents)}`, {
		filepath: filename,
		...prettierConfig,
		fileWidth: 60, // force it not to be written on a single line
	});
};

inquirer
	.prompt(questions)
	.then(({ prettierOverrides, filenames }) => {
		const prettierConfig = {
			...defaults.prettier,
			...prettierOverrides,
		};

		const createFile = (filename, contents) =>
			writeFile(filename, format(filename, contents, prettierConfig));

		const writeEslintConfig = ora.promise(createFile(filenames.eslint, defaults.eslint), {
			text: 'Creating eslint file',
		});

		const writePrettierConfig = ora.promise(createFile(filenames.prettier, prettierConfig), {
			text: 'Creating prettier file',
		});

		return Promise.all([writeEslintConfig, writePrettierConfig]);
	})
	.then(() => {
		console.log('Installing dependencies…');

		const install = spawn(
			'npm',
			[
				'install',
				'--save-dev',
				'eslint',
				'prettier',
				'eslint-config-prettier',
				'eslint-plugin-prettier',
			],
			{ stdio: 'inherit' },
		);
		install.on('close', code => {
			process.exitCode = code;

			if (!code) {
				console.log('Something went wrong installing the dependencies');
				console.log(`child process exited with code ${code}`);
			} else {
				console.log('\x1b[32m', 'Done!', '\x1b[0m');
			}
		});
	});
