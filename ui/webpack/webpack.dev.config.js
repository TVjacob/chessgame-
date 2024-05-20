const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');

const parentDir = path.join(__dirname, '../');

module.exports = merge(common, {
    mode: 'development',
    plugins: [
        new webpack.DefinePlugin({
            AMPLITUDE_API_KEY: JSON.stringify('96de180f1d7af682c55a2f2e85c8056f'),
        }),
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: parentDir,
        historyApiFallback: true,
        proxy: {
            '/api/*': {
                target: 'http://localhost:5000/',
                secure: false,
            },
            '/login': {
                target: 'http://localhost:5000/',
                secure: false,
            },
            '/logout': {
                target: 'http://localhost:5000/',
                secure: false,
            },
            '/socket.io': {
                target: 'http://localhost:5000/',
                secure: false,
            },
        }
    },
});
