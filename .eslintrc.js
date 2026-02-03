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
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended'
    ],
    rules: { 'react/prop-types': 'off' },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
