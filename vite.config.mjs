import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig(({ mode }) => ({
    plugins: [
        react({
            jsxRuntime: 'classic'
        }),
        ...(process.env.SENTRY_AUTH_TOKEN
            ? [
                  sentryVitePlugin({
                      authToken: process.env.SENTRY_AUTH_TOKEN,
                      release: {
                          name: process.env.VITE_VERSION || process.env.VERSION || 'Local build'
                      },
                      org: 'throneteki',
                      project: 'keyteki'
                  })
              ]
            : [])
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
                VERSION: process.env.VERSION || process.env.VITE_VERSION || 'development'
            }
        },
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.VERSION': JSON.stringify(
            process.env.VERSION || process.env.VITE_VERSION || 'development'
        ),
        'import.meta.env.VITE_VERSION': JSON.stringify(
            process.env.VITE_VERSION || process.env.VERSION || 'development'
        )
    },
    build: {
        sourcemap: true,
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(__dirname, 'index.html')
        }
    },
    publicDir: 'public'
}));
