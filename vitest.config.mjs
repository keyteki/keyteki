import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Test file patterns
        include: ['test/**/*.spec.js'],

        // Setup files
        setupFiles: ['test/helpers/integrationhelper.js'],

        // Enable globals (describe, it, expect, beforeEach, etc.)
        globals: true,

        // Pool configuration for parallelization
        pool: 'threads',
        maxWorkers: undefined, // Use default (based on CPU cores)
        fileParallelism: true,

        // Faster test isolation
        isolate: false,

        // Reporter
        reporters: ['./test/helpers/vitest-reporter.js'],

        // Timeout per test
        testTimeout: 1000,

        // Watch configuration - include source and test directories for changes
        forceRerunTriggers: ['server/game/**', 'test/server/**'],

        // Disable CSS/asset processing (not needed for server tests)
        css: false
    }
});
