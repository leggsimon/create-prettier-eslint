#!/usr/bin/env node

const fs = require('fs').promises;

const prettier = require('prettier');

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

const writeEslintConfig = fs.writeFile(
	'.eslintrc.js',
	prettier.format(`module.exports = ${JSON.stringify(defaultEslintOptions)}`, {
		filepath: '.eslintrc.js',
		...defaultPrettierOptions,
	}),
);

const writePrettierConfig = fs.writeFile(
	'.prettierrc',
	prettier.format(JSON.stringify(defaultPrettierOptions), {
		filepath: '.prettierrc',
		...defaultPrettierOptions,
		printWidth: 20,
	}),
);

Promise.all([writeEslintConfig, writePrettierConfig]).then(() => {
	console.log('\x1b[32m', 'Done!', '\x1b[0m');
});
