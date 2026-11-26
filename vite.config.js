import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const src = folder => path.resolve(import.meta.dirname, 'src', folder);

// The app imports from its top-level src folders directly (e.g. 'shared/components').
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  resolve: {
    alias: {
      shared: src('shared'),
      App: src('App'),
      Project: src('Project'),
      config: src('config'),
      browserHistory: src('browserHistory.js'),
    },
  },
});
