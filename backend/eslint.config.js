import { defineConfig, globalIgnores } from 'eslint/config'
import tsParser from '@typescript-eslint/parser'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.ts'],
    extends: [
      tseslint.configs.recommended,
      eslintConfigPrettier,
    ],
    rules: {
      'no-console': ['warn', {
          allow: ['error', 'warn']
        }
      ]
    },
    languageOptions: {
			parser: tsParser,
		},
  },
])