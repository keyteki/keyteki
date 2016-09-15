require('webpack');

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],

        files: [
            'test/client/tests.webpack.js'
        ],

        preprocessors: {
            'test/client/tests.webpack.js': ['webpack', 'sourcemap']
        },

        reporters: ['dots', 'coverage'],

        webpack: {
            devtool: 'inline-source-map',

            module: {
                loaders: [
                    {
                        test: /\.jsx?/,
                        loader: 'babel'
                    }
                ]
                // postLoaders: [{
                //     test: /\.jsx$/,
                //     exclude: /(spec|node_modules|bower_components)\//,
                //     loader: 'istanbul-instrumenter'
                // }]
            }
        },
        webpackMiddleware: {
            noInfo: true
        },

        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },

        port: 9877,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false,
        concurrency: Infinity
    });
};
