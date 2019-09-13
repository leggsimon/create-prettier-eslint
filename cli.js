#!/usr/bin/env node

const fs = require('fs');
const { spawn } = require('child_process');
const { promisify } = require('util');
const inquirer = require('inquirer');
const prettier = require('prettier');

const writeFile = promisify(fs.writeFile);

const defaultEslintOptions = {
	parserOptions: {
		ecmaVersion: 2017,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	extends: ['prettier'],
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': ['error'],
	},
};

const defaultPrettierOptions = {
	semi: true,
	trailingComma: 'all',
	singleQuote: true,
	useTabs: true,
};

inquirer
	.prompt([
		{
			type: 'list',
			name: 'prettierOverrides.useTabs',
			message: 'Do you use tabs or spaces?',
			choices: [{ name: 'Tabs', value: true }, { name: 'Spaces', value: false }],
		},
		{
			type: 'list',
			name: 'prettierOverrides.semi',
			message: 'Print semicolons at the ends of statements?',
			choices: [{ name: 'Yes', value: true }, { name: 'No', value: false }],
		},
		{
			type: 'list',
			name: 'filenames.eslint',
			message: 'What type of eslint config file would you like?',
			choices: [
				'.eslintrc.js',
				'.eslintrc.json',
				{
					name: '.eslintrc (JSON syntax)',
					value: '.eslintrc',
				},
			],
		},
		{
			type: 'list',
			name: 'filenames.prettier',
			message: 'What type of prettier config file would you like?',
			choices: [
				'.prettierrc.js',
				'.prettierrc.config.js',
				'.prettierrc.json',
				{
					name: '.prettierrc (JSON syntax)',
					value: '.prettierrc',
				},
			],
		},
	])
	.then(({ prettierOverrides, filenames }) => {
		const prettierConfig = {
			...defaultPrettierOptions,
			...prettierOverrides,
		};

		const writeEslintConfig = writeFile(
			filenames.eslint,
			prettier.format(
				`${filenames.eslint.endsWith('.js') ? 'module.exports = ' : ''}${JSON.stringify(
					defaultEslintOptions,
				)}`,
				{
					filepath: filenames.eslint,
					...prettierConfig,
				},
			),
		);

		const writePrettierConfig = writeFile(
			filenames.prettier,
			prettier.format(
				`${filenames.prettier.endsWith('.js') ? 'module.exports = ' : ''}${JSON.stringify(
					prettierConfig,
				)}`,
				{
					filepath: filenames.prettier,
					...prettierConfig,
					printWidth: 40, // force it not to be written on a single line
				},
			),
		);

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
