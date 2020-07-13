const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            assets: path.resolve('./client/assets')
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './views/index.pug',
            inject: true
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /[\\/]node_modules[\\/](?!(@sendgrid\/mail|debug|engine.io-client|socket.io-client|cross-env|eslint-config-prettier|eslint-plugin-jest|eslint-plugin-prettier|lint-staged|pg|prettier|socket.io|winston)[\\/])/,
                loader: 'babel-loader'
            },
            {
                test: /.(jpe?g|png|woff(2)?|eot|ttf|cur|svg|mp3|ogg)(\?[a-z0-9=.]+)?$/,
                use: 'url-loader?limit=16384'
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            {
                test: /\.json/,
                exclude: /node_modules/,
                type: 'javascript/auto',
                use: [require.resolve('json-loader')]
            },
            { test: /\.pug$/, include: path.join(__dirname, 'views'), loaders: ['pug-loader'] }
        ]
    }
};
