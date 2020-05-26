module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
        browser: true
    },
    parserOptions: {
        ecmaVersion: 11
    },
    parser: 'babel-eslint',
    plugins: ['react', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        'plugin:jest/recommended'
    ],
    rules: { 'react/prop-types': 'off' },
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
