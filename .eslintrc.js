module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
        browser: true
    },
    parserOptions: {
        ecmaVersion: 11,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ['react', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended'
    ],
    rules: { 'react/prop-types': 'off', 'prefer-const': 'error', 'no-var': 'error' },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
