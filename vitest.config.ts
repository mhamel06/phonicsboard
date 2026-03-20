import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['__tests__/engine/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
});
