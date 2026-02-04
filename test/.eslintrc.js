module.exports = {
    root: true,
    env: {
        node: true
    },
    parser: 'babel-eslint',
    plugins: ['react', 'prettier'],
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
    rules: {
        'no-restricted-syntax': [
            'error',
            {
                selector: 'MemberExpression[object.name="describe"][property.name="only"]',
                message: 'Remove focused test (describe.only)'
            },
            {
                selector: 'MemberExpression[object.name="it"][property.name="only"]',
                message: 'Remove focused test (it.only)'
            }
        ]
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    globals: {
        afterEach: true,
        beforeEach: true,
        describe: true,
        expect: true,
        globalThis: true,
        it: true,
        vi: true
    }
};
