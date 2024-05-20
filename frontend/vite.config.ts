import * as path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/assets',
    build: {
        manifest: true,
        outDir: path.join(__dirname, '..', 'assets'),
        assetsDir: '.',
        emptyOutDir: true,
        ssrEmitAssets: true,
        rollupOptions: {
            input: path.join(__dirname, 'index.html'),
            plugins: [nodeResolve(), commonjs()],
        },
    },
});
