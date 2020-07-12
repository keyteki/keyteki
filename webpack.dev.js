const webpack = require('webpack');
const merge = require('webpack-merge');
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
        filename: '[name].[hash].js'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        inline: true,
        historyApiFallback: true,
        publicPath: '/'
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
});
