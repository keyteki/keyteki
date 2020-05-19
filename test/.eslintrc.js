module.exports = {
    root: true,
    env: {
        jasmine: true,
        node: true
    },
    parser: 'babel-eslint',
    plugins: ['react', 'prettier', 'jasmine'],
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
    settings: {
        react: {
            version: 'detect'
        }
    },
    globals: {
        integration: true
    }
};
