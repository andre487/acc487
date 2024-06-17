import {nodeResolve} from '@rollup/plugin-node-resolve';
import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import {typescriptPaths} from 'rollup-plugin-typescript-paths';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/assets',
    build: {
        manifest: true,
        sourcemap: process.env.NODE_ENV !== 'production' ? 'inline' : false,
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
            ],
        },
    },
});
