module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
        browser: true
    },
    parser: 'babel-eslint',
    plugins: ['react', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        'plugin:jest/recommended'
    ],
    settings: {
        react: {
            version: 'detect'
        }
    },
    overrides: [
        {
            files: ['*.test.js'],
            env: {
                jasmine: true
            },
            plugins: ['jest']
        }
    ]
};
