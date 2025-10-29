import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import commonjs from 'vite-plugin-commonjs';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [
    commonjs(),
    react({
      exclude: /\.stories\.(t|j)sx?$/,
    }),
    svgr()
  ],
});