import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
    minify: 'esbuild'
  }
});
