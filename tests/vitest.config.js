import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    root: path.resolve(__dirname, '..'),
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'frontend/src/lib/security/**',
        'frontend/src/components/HealthScoreRing.jsx',
        'frontend/src/components/VaaniBot.jsx'
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60
      }
    }
  }
});
