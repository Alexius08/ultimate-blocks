const path = require('path');

const packageJsonAliasMap = require(path.resolve('./package.json')).alias;

module.exports = {
	extends: ['plugin:@wordpress/eslint-plugin/recommended'],
	plugins: ['import'],
	parser: '@babel/eslint-parser',
	parserOptions: {
		requireConfigFile: false,
		babelOptions: {
			presets: ['@babel/preset-react'],
		},
	},
	settings: {
		'import/resolver': {
			webpack: {
				config: './webpack.config.js',
			},
			'eslint-import-resolver-custom-alias': {
				alias: packageJsonAliasMap,
				extensions: ['.js', '.jsx'],
			},
		},
	},
	globals: {
		self: true,
		ubPriorityData: true,
		UB_ENV: true,
	},
};
