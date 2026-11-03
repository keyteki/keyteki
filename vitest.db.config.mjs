import { defineConfig } from 'vitest/config';

// Database integration tests, run by npm run test:db against the database in config/test.json5
export default defineConfig({
    test: {
        include: ['test/server/db-integration/**/*.spec.js'],
        setupFiles: ['test/server/db-integration/helpers/database.js'],
        globals: true,

        // Every test empties the same database, so run the files one at a time
        fileParallelism: false,

        testTimeout: 10000,
        css: false
    }
});
