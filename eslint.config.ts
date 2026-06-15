import eslintReact from '@eslint-react/eslint-plugin';
import js from '@eslint/js';
import type { Linter } from 'eslint';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

const config: Linter.Config[] = [
    // Ignored paths
    {
        ignores: ['coverage/**', 'dist/**', 'keyteki-json-data/**', 'node_modules/**', 'public/**']
    },
    // ESLint recommended rules
    js.configs.recommended,
    // Base config for all JS/JSX files
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2020
            }
        },
        rules: {
            'prefer-const': 'error',
            'no-var': 'error'
        }
    },
    // React rules for client code
    {
        files: ['client/**/*.{js,jsx}'],
        languageOptions: {
            globals: {
                ...globals.browser
            }
        },
        ...eslintReact.configs.recommended
    },
    // Prettier must come after all rule-defining blocks
    prettier,
    // Test overrides
    {
        files: ['test/**/*.{js,jsx}'],
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
