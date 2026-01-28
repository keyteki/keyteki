module.exports = {
    root: true,
    env: {
        node: true
    },
    parser: 'babel-eslint',
    plugins: ['react', 'prettier'],
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
    rules: {},
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
