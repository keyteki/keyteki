import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
    plugins: [
        react({
            jsxRuntime: 'classic'
        })
    ],
    resolve: {
        mainFields: ['browser', 'module', 'main'],
        alias: [
            {
                find: 'assets',
                replacement: path.resolve(__dirname, 'client/assets')
            }
        ]
    },
    css: {
        preprocessorOptions: {
            scss: {
                quietDeps: true,
                silenceDeprecations: ['legacy-js-api']
            }
        }
    },
    define: {
        process: {
            env: {
                NODE_ENV: mode,
                VERSION: process.env.VERSION || 'development'
            }
        },
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.VERSION': JSON.stringify(process.env.VERSION || 'development'),
        'import.meta.env.VERSION': JSON.stringify(process.env.VERSION || 'development')
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(__dirname, 'index.html')
        }
    },
    publicDir: 'public'
}));
