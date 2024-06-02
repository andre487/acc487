import * as path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

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
        minify: process.env.NODE_ENV !== 'development',
        rollupOptions: {
            input: path.join(__dirname, 'index.html'),
            plugins: [
                typescriptPaths({preserveExtensions: true}),
                nodeResolve(),
                commonjs(),
            ],
        },
    },
});
