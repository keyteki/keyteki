const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin({ filename: 'vendor-assets.json' });

const BUILD_DIR = path.resolve(__dirname, 'public');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    const sharedConfig = {
        stats: { modules: false },
        resolve: {
            extensions: ['.js'],
            alias: {
                'jquery.validation': 'jquery-validation/dist/jquery.validate.js'
            }
        },
        module: {
            rules: [
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' }
            ]
        },
        entry: {
            vendor: [
                'bootstrap',
                'babel-polyfill',
                'event-source-polyfill',
                'react',
                'react-async-script',
                'react-bootstrap-slider',
                'react-bootstrap-typeahead',
                'react-google-recaptcha',
                'react-dom',
                'react-redux',
                'react-redux-toastr',
                'redux',
                'redux-thunk',
                'jquery',
                'jquery-migrate',
                'jquery-validation',
                'jquery-validation-unobtrusive',
                'moment',
                'prop-types',
                'socket.io-client',
                'query-string',
                'path-to-regexp',
                'classnames',
                'react-dnd',
                'react-dnd-touch-backend',
                'react-transition-group'
            ]
        },
        devtool: isDevBuild ? 'inline-source-map' : 'source-map',
        output: {
            publicPath: '/',
            filename: '[name]-[hash].js',
            library: '[name]_[hash]'
        },
        plugins: [
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }),
            new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve('node-noop')), // Workaround for https://github.com/andris9/encoding/issues/16
            assetsPluginInstance
        ]
    };

    const clientBundleConfig = merge(sharedConfig, {
        output: { path: BUILD_DIR },
        module: {
            rules: [
            ]
        },
        plugins: [
            new webpack.DllPlugin({
                path: path.join(BUILD_DIR, '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ]
    });

    return clientBundleConfig;
};
