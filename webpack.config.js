"use strict";

const webpack = require('webpack');
const path = require('path');

//const debug = process.env.NODE_ENV !== "production";
const debug = false;

const itend = true;

const entryFile = itend ? path.join(__dirname, 'app-it.js') : path.join(__dirname, 'app-client.js');
const outputFile = itend ? path.join(__dirname, 'private', 'js') : path.join(__dirname, 'public', 'js');


module.exports = {
  devtool: debug ? 'inline-sourcemap' : false,
  entry: entryFile,
//  devServer: {
//    inline: true,
//    port: 3333,
//    contentBase: "src/static/",
//    historyApiFallback: {
//      index: '/index-static.html'
//    }
//  },
  output: {
    path: outputFile,
    publicPath: "/js/",
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: path.join(__dirname),
		 use: {loader: 'babel-loader',
				options: {
					cacheDirectory: 'babel_cache',
//					presets: debug ? ['react', 'es2015', 'react-hmre'] : ['react', 'es2015']
					presets: ['react', 'es2015']
				}
				},
    }]
  },
	plugins: debug ? [] : [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
//    new webpack.optimize.DedupePlugin(),
//    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
//      compress: { warnings: false },
//      mangle: true,
//      sourcemap: false,
//      beautify: false,
//      dead_code: true
    })
  ]
};



//NODE_ENV=production node_modules/.bin/webpack -p