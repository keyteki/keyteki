import eslintReact from '@eslint-react/eslint-plugin';
import js from '@eslint/js';
import type { Linter } from 'eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const config: Linter.Config[] = [
    // Ignored paths
    {
        ignores: ['coverage/**', 'dist/**', 'node_modules/**', 'public/**']
    },
    // ESLint recommended rules
    js.configs.recommended,
    // Base config for all source files
    {
        files: ['**/*.{js,jsx,mjs,ts,tsx}'],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: { jsx: true }
            },
            globals: {
                ...globals.node,
                ...globals.es2020
            }
        },
        rules: {
            // TODO: New rules from eslint v10 migration — disable until codebase is fixed
            'no-useless-assignment': 'off',
            'preserve-caught-error': 'off',
            'no-unused-vars': 'off'
        }
    },
    // TypeScript parser for .ts/.tsx files
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser
        }
    },
    // React rules for client code
    {
        files: ['client/**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser
            }
        },
        ...eslintReact.configs.recommended,
        rules: {
            ...eslintReact.configs.recommended.rules,
            // TODO: New rules from eslint v10 migration — disable until codebase is fixed
            '@eslint-react/set-state-in-effect': 'off',
            '@eslint-react/no-array-index-key': 'off',
            '@eslint-react/naming-convention-ref-name': 'off',
            '@eslint-react/use-state': 'off',
            '@eslint-react/purity': 'off',
            '@eslint-react/no-forward-ref': 'off',
            '@eslint-react/no-unsafe-component-will-receive-props': 'off',
            '@eslint-react/exhaustive-deps': 'off'
        }
    },
    // Disable rules that conflict with Prettier
    prettierConfig,
    // Test overrides
    {
        files: ['test/**/*.{js,jsx,mjs,ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.vitest
            }
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
];

export default config;
