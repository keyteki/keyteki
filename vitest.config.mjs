import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Test file patterns
        include: ['test/**/*.spec.js'],

        // Setup files (replaces jasmine helpers)
        setupFiles: ['test/helpers/integrationhelper.js'],

        // Enable globals (describe, it, expect, beforeEach, etc.)
        globals: true,

        // Parallelization - use worker threads (vitest 0.34 syntax)
        threads: true,

        // Parallelization - use atomics (vitest 0.34 syntax)
        useAtomics: true,

        // Caching - enabled by default, but be explicit
        cache: {
            dir: 'node_modules/.vitest'
        },

        // Faster test isolation
        isolate: false,

        // Reporter (vitest 0.34 uses 'reporters' array)
        // reporters: ['verbose'],
        reporters: ['dot'],

        // Timeout per test
        testTimeout: 10000,

        // Watch additional files for changes (e.g., card implementations)
        watchExclude: ['**/node_modules/**', '**/dist/**'],

        // Disable CSS/asset processing (not needed for server tests)
        css: false
    }
});
