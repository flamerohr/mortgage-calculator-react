/**
 * Build assets for Flamer's site
 */
const NODE_ENV      = (process.argv.indexOf('-p') > -1 || process.env.NODE_ENV == 'production') ?
	'production' :
	'development',
			webpack       = require('webpack'),
			path          = require('path'),
			node_modules  = path.resolve(__dirname, 'node_modules'),
			extractPlugin = require("extract-text-webpack-plugin"),
			autoprefixer  = require('autoprefixer');
require('es6-promise').polyfill();

var themeDir           = 'mortgage-react/',
		definePlugin       = new webpack.DefinePlugin({ NODE_ENV: JSON.stringify(NODE_ENV) }),
		chunksSharedPlugin = new webpack.optimize.CommonsChunkPlugin({
			name:     'shared',
			filename: '[name].js',
			chunks:   ['main']
		}),
		chunksVendorPlugin = new webpack.optimize.CommonsChunkPlugin({
			name:     'vendor',
			filename: '[name].js'
		}),
		stylesPlugin       = new extractPlugin(path.resolve(__dirname, 'css/dist/[name].css'), { allChunks: true });

var plugins = [
	definePlugin,
	// chunksSharedPlugin,
	chunksVendorPlugin
];
if (NODE_ENV == 'production') {
	plugins.push(stylesPlugin);
}

var cssLoaders = [
	"style",
	"css?soureMap",
	"postcss",
	"resolve-url",
	"sass?soureMap"
];

var sourceMap = (NODE_ENV == 'development') ? 'source-map' : null;

module.exports = {
	entry:   {
		vendor: [
			// "jquery",
			"react",
			"react-dom"
		],
		main:   './javascript/index.jsx'
	},
	output:  {
		path:          path.resolve(__dirname, 'javascript/dist/'),
		filename:      '[name].js',
		publicPath:    themeDir + 'javascript/dist/',
		chunkFilename: '[id].js'
	},
	cache:   true,
	devtool: sourceMap,
	resolve: {
		extensions: [
			'',
			'.js',
			'.json',
			'.jsx',
			'.scss',
			'.css'
		],
		alias:      {
			'jquery': path.resolve(node_modules, 'jquery/dist/jquery.min.js')
		}
	},
	module:  {
		preLoaders: [
			{
				test:    /\.jsx?$/,
				loaders: ['eslint'],
				exclude: /node_modules/
			}
		],
		loaders:    [
			{
				test:    /\.jsx?$/,
				loader:  'babel',
				query:   {
					presets: [
						'es2015',
						'react'
					],
				},
				exclude: /node_modules/
			},
			{
				test:    /\.scss$/,
				loaders: cssLoaders
			},
			{
				test:   /(jpe?g|png|gif|svg)$/,
				loader: 'file',
				query: {
					name: '../../images/dist/[name].[ext]?[hash]'
				}
			}
		]
	},
	plugins: plugins,
	postcss: function () {
		return [autoprefixer({ browsers: ['last 2 versions'] })];
	}
};
