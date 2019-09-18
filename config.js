module.exports = {
	defaults: {
		eslint: {
			parserOptions: {
				ecmaVersion: 2017,
				sourceType: 'module',
			},
			extends: ['eslint:recommended', 'prettier'],
			plugins: ['prettier'],
			rules: {
				'prettier/prettier': ['error'],
			},
		},
		prettier: {
			semi: true,
			trailingComma: 'all',
			singleQuote: true,
			useTabs: true,
		},
	},
	questions: [
		{
			type: 'list',
			name: 'prettier.useTabs',
			message: 'Do you use tabs or spaces?',
			choices: [
				{ name: 'Tabs', value: true },
				{ name: 'Spaces', value: false },
			],
		},
		{
			type: 'list',
			name: 'prettier.semi',
			message: 'Print semicolons at the ends of statements?',
			choices: [{ name: 'Yes', value: true }, { name: 'No', value: false }],
		},
		{
			type: 'checkbox',
			name: 'eslint.env',
			message:
				'What environments are you working in? These predefine some global variables.\n',
			choices: [
				{ name: 'browser', checked: true },
				{ name: 'node', checked: true },
				{ name: 'mocha', checked: false },
				{ name: 'jest', checked: false },
			],
		},
		{
			type: 'list',
			name: 'useReact',
			message: 'Are you using React/JSX?',
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
		{
			type: 'list',
			name: 'saveGlobalConfig',
			message: 'Would you like to save these globally so I won’t ask again?',
			choices: [{ name: 'Yes', value: true }, { name: 'No', value: false }],
		},
	],
};
