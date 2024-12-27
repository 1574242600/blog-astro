import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginSolid from 'eslint-plugin-solid'
import * as tsParser from '@typescript-eslint/parser'

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: {...globals.browser, ...globals.node} } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...eslintPluginAstro.configs.recommended,
    ...eslintPluginAstro.configs['jsx-a11y-recommended'],
    {
        files: ['**/*.{ts,tsx}'],
        ...eslintPluginSolid.configs['flat/typescript'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: 'tsconfig.json',
            },
        },
    },
    {
        rules: {
            indent: [
                'error',
                4
            ],
            'linebreak-style': [
                'error',
                'unix'
            ],
            quotes: [
                'error',
                'single'
            ],
            semi: [
                'error',
                'never'
            ]
        }
    },
    {
        ignores: ['src/env.d.ts']
    }
]