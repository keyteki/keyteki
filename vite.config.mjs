import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom plugin to transform JSX in react-redux-toastr
function transformJsxInNodeModules() {
    return {
        name: 'transform-jsx-in-node-modules',
        enforce: 'pre',
        async transform(code, id) {
            if (id.includes('react-redux-toastr') && id.endsWith('.js') && code.includes('<')) {
                const esbuild = await import('esbuild');
                const result = await esbuild.transform(code, {
                    loader: 'jsx',
                    jsx: 'transform',
                    jsxFactory: 'React.createElement',
                    jsxFragment: 'React.Fragment'
                });
                return {
                    code: result.code,
                    map: null
                };
            }
            return null;
        }
    };
}

export default defineConfig(({ mode }) => ({
    plugins: [
        transformJsxInNodeModules(),
        react({
            jsxRuntime: 'classic',
            include: [/\.(jsx|js|tsx|ts)$/, /react-redux-toastr.*\.js$/]
        })
    ],
    resolve: {
        alias: {
            assets: path.resolve(__dirname, 'client/assets'),
            'react/jsx-runtime': path.resolve(__dirname, 'client/shims/react-jsx-runtime.js'),
            'react/jsx-dev-runtime': path.resolve(__dirname, 'client/shims/react-jsx-runtime.js')
        }
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.VERSION': JSON.stringify(process.env.VERSION || 'development')
    },
    optimizeDeps: {
        include: ['react-redux-toastr'],
        esbuildOptions: {
            loader: {
                '.js': 'jsx'
            },
            jsx: 'transform',
            jsxFactory: 'React.createElement',
            jsxFragment: 'React.Fragment'
        }
    },
    esbuild: {
        jsx: 'transform',
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment'
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(__dirname, 'index.html')
        },
        commonjsOptions: {
            transformMixedEsModules: true,
            include: [/node_modules/],
            extensions: ['.js', '.cjs'],
            // Exclude JSX files from commonjs transform - let esbuild handle them
            exclude: [/node_modules\/react-redux-toastr/]
        }
    },
    publicDir: 'public'
}));
