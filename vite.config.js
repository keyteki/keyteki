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
        }
    },
    publicDir: 'public'
}));
