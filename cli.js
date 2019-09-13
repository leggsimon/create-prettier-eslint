#!/usr/bin/env node

const fs = require('fs');
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
			name: 'prettier.useTabs',
			message: 'Do you use tabs or spaces?',
			choices: [
				{ name: 'Tabs', value: true },
				{ name: 'Spaces', value: false },
			],
		},
	])
	.then(answers => {
		const prettierConfig = {
			...defaultPrettierOptions,
			...answers.prettier,
		};
		const writeEslintConfig = writeFile(
			'.eslintrc.js',
			prettier.format(
				`module.exports = ${JSON.stringify(defaultEslintOptions)}`,
				{
					filepath: '.eslintrc.js',
					...prettierConfig,
				},
			),
		);

		const writePrettierConfig = writeFile(
			'.prettierrc',
			prettier.format(JSON.stringify(prettierConfig), {
				filepath: '.prettierrc',
				...prettierConfig,
				printWidth: 20,
			}),
		);

		return Promise.all([writeEslintConfig, writePrettierConfig]);
	})
	.then(() => {
		console.log('\x1b[32m', 'Done!', '\x1b[0m');
	});
