const path = require('path')
const webpack = require('webpack')

const resolve = (dir) => path.join(__dirname, dir)

module.exports = {
	publicPath: './',
	assetsDir: 'pack',
	outputDir: 'dist/account',
	productionSourceMap: false,
	lintOnSave: false,

	devServer: {
		open: false,
		port: 5200,
		https: false,
	},
	css: {
		sourceMap: true,
	},

	chainWebpack(config) {
		config.resolve.alias
		.set('@', resolve('src'))
		.set('@c', resolve('src/components'))
		.set('@v', resolve('src/views'))
	},

	configureWebpack: {
		plugins: [
			new webpack.ProvidePlugin({
				jQuery: 'jquery',
				$: 'jquery',
			}),
		],
	},
}
