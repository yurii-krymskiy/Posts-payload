import { dirname } from 'path'
import { fileURLToPath } from 'url'

// Avoid importing @eslint/eslintrc in environments where devDependencies are not installed (e.g. Vercel)
const isVercel = process.env.VERCEL === '1'
let FlatCompat
if (!isVercel) {
  try {
    // Dynamic import to prevent hard failure when the package isn't present
    ; ({ FlatCompat } = await import('@eslint/eslintrc'))
  } catch {
    // leave FlatCompat undefined and fall back to a minimal config below
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = FlatCompat
  ? new FlatCompat({
    baseDirectory: __dirname,
  })
  : null

const eslintConfig = compat
  ? [
    // Use compat to pull in Next.js recommended config when available
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
      rules: {
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/no-empty-object-type': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: false,
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^(_|ignore)',
          },
        ],
      },
    },
    {
      ignores: ['.next/'],
    },
  ]
  : [
    // Minimal fallback config when compat isn't available (e.g. Vercel prod build)
    {
      ignores: ['.next/'],
    },
  ]

export default eslintConfig
