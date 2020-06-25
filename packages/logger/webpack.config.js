module.exports = {
	entry: './src/index',
	output: {
		path: __dirname,
		filename: './dist/browser.js',
	},
	resolve: {
		extensions: ['.js', '.ts'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/, use: ['babel-loader', 'ts-loader'], exclude: /node_modules/
			}
		]
	}
  };
