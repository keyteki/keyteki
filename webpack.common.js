const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            assets: path.resolve('./client/assets'),
            'process/browser': require.resolve('process/browser')
        },
        extensionAlias: {
            '.js': ['.js', '.ts', '.tsx']
        },
        fallback: {
            process: require.resolve('process/browser'),
            'process/browser': require.resolve('process/browser'),
            buffer: require.resolve('buffer/'),
            util: require.resolve('util/'),
            url: require.resolve('url/'),
            http: false,
            https: false,
            stream: require.resolve('stream-browserify'),
            crypto: false,
            fs: false,
            path: require.resolve('path-browserify')
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
            jQuery: 'jquery',
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser'
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify({
                VERSION: process.env.VERSION || 'development',
                NODE_ENV: process.env.NODE_ENV || 'development'
            })
        })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    optimization: {
        moduleIds: 'deterministic',
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
                exclude: /[\\/]node_modules[\\/](?!(@sendgrid\/mail|debug|engine.io-client|socket.io-client|cross-env|eslint-config-prettier|eslint-plugin-jest|eslint-plugin-prettier|lint-staged|pg|prettier|socket.io|winston)[\\/])|\.json$/,
                loader: 'babel-loader'
            },
            {
                test: /.(jpe?g|png|woff(2)?|eot|ttf|cur|svg|mp3|ogg)(\?[a-z0-9=.]+)?$/,
                type: 'asset/resource'
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            {
                test: /\.pug$/,
                include: path.join(__dirname, 'views'),
                use: [
                    {
                        loader: 'pug-loader',
                        options: {
                            pretty: true
                        }
                    }
                ]
            }
        ]
    }
};
