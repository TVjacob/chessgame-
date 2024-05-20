const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');

const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            AMPLITUDE_API_KEY: JSON.stringify('96de180f1d7af682c55a2f2e85c8056f'),
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new UglifyJsPlugin(),
        new CompressionPlugin(),
    ],
});
