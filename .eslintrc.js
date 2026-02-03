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
    },
    overrides: [
        {
            files: ['**/*.spec.js'],
            globals: {
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                vi: 'readonly'
            },
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
            }
        }
    ]
};
