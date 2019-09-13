#!/usr/bin/env node

const fs = require('fs').promises;

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
	`module.exports = ${JSON.stringify(defaultEslintOptions, null, 2)}`,
);

const writePrettierConfig = fs.writeFile(
	'.prettierrc',
	JSON.stringify(defaultPrettierOptions, null, 2),
);

Promise.all([writeEslintConfig, writePrettierConfig]).then(() => {
	console.log('\x1b[32m', 'Done!', '\x1b[0m');
});
