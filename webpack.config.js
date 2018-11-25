const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin({ filename: 'assets.json' });

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    const sharedConfig = () => ({
        stats: { modules: false },
        resolve: { extensions: ['.js', '.jsx'] },
        output: {
            filename: isDevBuild ? '[name].js' : '[name]-[hash].js',
            publicPath: '/'
        },
        module: {
            rules: [
                { test: /\.jsx?/, exclude: /node_modules/, loader: 'babel-loader' },
                { test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=.]+)?$/, use: 'url-loader?limit=25000' },
                { test: /\.json$/, loader: 'json-loader' }
            ]
        }
    });

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './public';
    const clientBundleConfig = merge(sharedConfig(), {
        entry: {
            'bundle': (isDevBuild ? [
                'react-hot-loader/patch',
                'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000',
                'webpack/hot/only-dev-server'] : []).concat(['./client/index.jsx', './less/site.less', 'babel-polyfill'])
        },
        devtool: isDevBuild ? 'inline-source-map' : 'source-map',
        module: {
            rules: isDevBuild ? [
                {
                    test: /\.css$/, use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']
                },
                {
                    test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']
                }
            ] : [
                {
                    test: /\.css$/, use: ExtractTextPlugin.extract(['css-loader?minimize'])
                },
                {
                    test: /\.less$/, use: ExtractTextPlugin.extract(['css-loader?minimize', 'less-loader'])
                },
                {
                    test: /\.scss$/, use: ExtractTextPlugin.extract(['css-loader?minimize', 'sass-loader'])
                }
            ]
        },
        output: { path: path.join(__dirname, clientBundleOutputDir) },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./public/vendor-manifest.json')
            }),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery'
            })
        ].concat(isDevBuild ? [
            new webpack.HotModuleReplacementPlugin()
        ] : [
            new ExtractTextPlugin('site-[hash].css'),
            assetsPluginInstance
        ])
    });

    return clientBundleConfig;
};
