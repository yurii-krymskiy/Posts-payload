import nextPlugin from '@next/eslint-plugin-next'

export default [
  // Enable Next.js recommended rules (core-web-vitals) without relying on @eslint/eslintrc
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    ignores: ['.next/', 'node_modules/'],
  },
]
