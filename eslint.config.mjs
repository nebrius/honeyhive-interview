import { getDirname } from 'cross-dirname';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { recommended } from 'eslint-plugin-fast-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintPluginPrettierRecommended,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),

  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'object-shorthand': 'error',

      // Handled by TypeScript eslint
      'no-unused-vars': 'off',
    },
  },

  recommended({
    entryPoints: {
      'src/app/**/page.tsx': ['default'],
      'src/app/**/layout.tsx': ['default', 'metadata'],
      '*config*': ['default'],
    },
    rootDir: getDirname(),
  }),
]);

export default eslintConfig;
