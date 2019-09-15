const { spawn } = require('child_process');

const installDependencies = (environment = 'prod') => (dependencies = []) => {
	return new Promise((resolve, reject) => {
		const install = spawn(
			'npm',
			['install', environment === 'dev' ? '--save-dev' : '--save', ...dependencies],
			{ stdio: 'inherit' },
		);
		install.on('close', code => {
			process.exitCode = code;

			if (code !== 0) {
				console.log('Something went wrong installing the dependencies');
				console.log(`child process exited with code ${code}`);
				reject(code); // should reject this
			} else {
				resolve();
			}
		});
	});
};

module.exports = {
	install: installDependencies('prod'),
	installDev: installDependencies('dev'),
};
