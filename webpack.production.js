const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    entry: {
        bundle: ['./client/index.jsx']
    },
    output: {
        filename: '[name].[contenthash].js'
    },
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader', 'scss-loader']
            }
        ]
    }
});
