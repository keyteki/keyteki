require('webpack');

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],

        files: [
            'test/client/tests.webpack.js',
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            { pattern: 'public/img/**/*.jpg', included: false, watched: false, served: true},
            { pattern: 'public/img/**/*.png', included: false, watched: false, served: true}
        ],

        proxies: {
            '/img': '/base/public/img',
            '/img/cards/00001.png': '/base/public/img/cards/cardback.jpg'
        },

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
                    },
                    {
                        test: /\.json?/,
                        loader: 'json'
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
