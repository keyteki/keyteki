const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    entry: {
        bundle: [
            '@babel/polyfill',
            'eventsource',
            'react-hot-loader/patch',
            './client/index.jsx',
            'webpack-hot-middleware/client'
        ]
    },
    output: {
        filename: '[name].[fullhash].js'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        hot: true,
        historyApiFallback: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
});
