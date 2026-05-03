import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      exclude: [
        'src/data/**',
        'src/types/**',
        'src/main.tsx',
        '*.config.*',
        'dist/**',
      ],
    },
  },
})
