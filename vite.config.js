import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import inject from '@rollup/plugin-inject';
import commonjs from 'vite-plugin-commonjs';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        inject({
            $: ['jquery', '*'],
            jQuery: 'jquery'
        }),
        commonjs({
            filter(id) {
                // `node_modules` is exclude by default, so we need to include it explicitly
                // https://github.com/vite-plugin/vite-plugin-commonjs/blob/v0.7.0/src/index.ts#L125-L127
                if (id.includes('node_modules/jquery-')) {
                    return true;
                }
            }
        }),
        nodePolyfills({
            // Whether to polyfill `node:` protocol imports.
            protocolImports: true
        }),
        sentryVitePlugin({
            org: 'throneteki',
            project: 'keyteki'
        })
    ],

    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx'
            }
        }
    },

    build: {
        sourcemap: true
    }
});
