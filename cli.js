#!/usr/bin/env node

const fs = require('fs');
const { promisify } = require('util');
const { homedir } = require('os');
const { join } = require('path');
const inquirer = require('inquirer');
const prettier = require('prettier');
const merge = require('deepmerge');
const { defaults, questions } = require('./config');
const { installDev } = require('./install-dependencies');
const writeFile = promisify(fs.writeFile);
const configFileName = join(homedir(), '.prettiereslint.config.json');

const format = (filename, contents, prettierConfig) => {
	const isJS = filename.endsWith('.js');
	return prettier.format(
		`${isJS ? 'module.exports = ' : ''}${JSON.stringify(contents)}`,
		{
			filepath: filename,
			...prettierConfig,
			fileWidth: 60, // force it not to be written on a single line
		},
	);
};

async function readConfigOrQuestion() {
	if (fs.existsSync(configFileName)) {
		console.log('Config file found. Using that');
		const config = require(configFileName);
		return config;
	} else {
		return inquirer.prompt(questions);
	}
}

const createFile = async (filename, contents, prettierConfig) => {
	try {
		await writeFile(filename, format(filename, contents, prettierConfig));
		console.log('\x1b[32m', '✔', '\x1b[0m', `Created ${filename}`);
	} catch (error) {
		console.log('\x1b[31m', '✘', '\x1b[0m', `Error creating ${filename}\n`);
		console.log(error);
	}
};

(async () => {
	const {
		prettierOverrides,
		filenames,
		saveGlobalConfig,
		useReact,
	} = await readConfigOrQuestion();

	const prettierConfig = {
		...defaults.prettier,
		...prettierOverrides,
	};

	const eslintConfig = merge(
		defaults.eslint,
		useReact
			? {
					parserOptions: {
						ecmaFeatures: {
							jsx: true,
						},
					},
					extends: ['react'],
			  }
			: {},
	);

	const writeEslintConfig = createFile(
		filenames.eslint,
		defaults.eslint,
		prettierConfig,
	);

	const writePrettierConfig = createFile(
		filenames.prettier,
		prettierConfig,
		prettierConfig,
	);

	const promises = [writeEslintConfig, writePrettierConfig];

	if (saveGlobalConfig) {
		promises.push(
			createFile(configFileName, {
				prettierOverrides: prettierConfig,
				filenames,
			}),
		);
	}

	await Promise.all(promises);

	console.log('Installing dependencies…');

	const requiredDependencies = [
		'eslint',
		'prettier',
		'eslint-config-prettier',
		'eslint-plugin-prettier',
		...(useReact ? ['eslint-plugin-react'] : []),
	];

	return await installDev(requiredDependencies);
})();
