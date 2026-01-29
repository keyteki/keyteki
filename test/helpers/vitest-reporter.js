/**
 * Minimal vitest reporter that shows progress without verbosity.
 * Displays a running tally of files and tests, delegates failure output to DefaultReporter.
 */

import { DefaultReporter } from 'vitest/reporters';

export default class CustomReporter extends DefaultReporter {
    constructor(options) {
        super(options);
        this.filesPassed = 0;
        this.filesFailed = 0;
        this.filesSkipped = 0;
        this.filesRun = 0;
        this.filesExpected = 0;
        this.testsPassed = 0;
        this.testsFailed = 0;
        this.testsSkipped = 0;
        this.startTime = Date.now();
        this._progressStarted = false;
        this._lastPrintTime = 0;
        this._printInterval = 100; // ms
        this._linesWritten = false;

        // Clean up progress on interrupt
        this._cleanup = () => {
            if (this._linesWritten) {
                process.stdout.write('\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K\r');
            }
        };
        process.on('SIGINT', this._cleanup);
        process.on('SIGTERM', this._cleanup);
    }

    // Override to suppress the header
    onTestRunStart(testModules) {
        this.filesPassed = 0;
        this.filesFailed = 0;
        this.filesSkipped = 0;
        this.filesRun = 0;
        this.filesExpected = testModules.length;
        this.testsPassed = 0;
        this.testsFailed = 0;
        this.testsSkipped = 0;
        this.startTime = Date.now();
        this._lastPrintTime = 0;
        this._progressStarted = true;
        this._linesWritten = false;
    }

    // Override to suppress per-file output
    onTestModuleQueued() {}
    onTestModuleCollected() {}
    onTestModuleStart() {}

    onTestModuleEnd(module) {
        this.filesRun++;
        const state = module.state;
        if (state === 'passed' || state === 1) {
            this.filesPassed++;
        } else if (state === 'failed' || state === 2) {
            this.filesFailed++;
        } else if (state === 'skipped' || state === 3) {
            this.filesSkipped++;
        } else {
            this.filesPassed++;
        }
        this._printProgress();
    }

    // Override to suppress individual test output
    onTestCaseReady() {}

    onTestCaseResult(testCase) {
        const state = testCase.state;
        if (state === 'passed' || state === 1) {
            this.testsPassed++;
        } else if (state === 'failed' || state === 2) {
            this.testsFailed++;
            this._printFailure(testCase);
        } else if (state === 'skipped' || state === 3) {
            this.testsSkipped++;
        } else {
            this.testsPassed++;
        }
        this._printProgress();
    }

    _printFailure(testCase) {
        // Clear progress lines, print failure, then re-print progress
        process.stdout.write('\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K\r');

        const red = '\x1b[31m';
        const reset = '\x1b[0m';
        const dim = '\x1b[2m';

        // Build test path from parent names
        let path = testCase.name;
        let parent = testCase.parent;
        while (parent && parent.name) {
            path = `${parent.name} > ${path}`;
            parent = parent.parent;
        }

        console.log(`\n${red}✕${reset} ${path}`);

        if (testCase.errors && testCase.errors.length > 0) {
            for (const error of testCase.errors) {
                const message = error.message || String(error);
                console.log(`  ${dim}${message}${reset}`);
            }
        }

        console.log('');
        // Re-print the 4 progress lines
        process.stdout.write('\n\n\n\n');
    }

    _printProgress(force = false) {
        const now = Date.now();
        if (!force && now - this._lastPrintTime < this._printInterval) {
            return;
        }
        this._lastPrintTime = now;

        const bold = '\x1b[1m';
        const reset = '\x1b[0m';
        const green = '\x1b[32m';
        const red = '\x1b[31m';
        const yellow = '\x1b[33m';

        const filePercent =
            this.filesExpected > 0 ? Math.round((this.filesRun / this.filesExpected) * 100) : 0;
        const fileFailed = `${bold}${red}${this.filesFailed} failed${reset}`;
        const filePassed = `${bold}${green}${this.filesPassed} passed${reset}`;
        const fileSkipped = `${bold}${yellow}${this.filesSkipped} skipped${reset}`;

        const testsTotal = this.testsPassed + this.testsFailed + this.testsSkipped;
        const testFailed = `${bold}${red}${this.testsFailed} failed${reset}`;
        const testPassed = `${bold}${green}${this.testsPassed} passed${reset}`;
        const testSkipped = `${bold}${yellow}${this.testsSkipped} skipped${reset}`;

        const startAt = new Date(this.startTime).toLocaleTimeString('en-US', { hour12: false });
        const elapsedMs = Date.now() - this.startTime;
        const elapsed = elapsedMs >= 1000 ? `${(elapsedMs / 1000).toFixed(2)}s` : `${elapsedMs}ms`;

        // Build the output
        const output =
            ` Test Files  ${fileFailed} | ${filePassed} | ${fileSkipped} (${this.filesRun}/${this.filesExpected} ${filePercent}%)\n` +
            `      Tests  ${testFailed} | ${testPassed} | ${testSkipped} (${testsTotal})\n` +
            `   Start at  ${startAt}\n` +
            `   Duration  ${elapsed}`;

        if (this._linesWritten) {
            // Clear previous 4 lines and rewrite
            process.stdout.write('\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K\r' + output);
        } else {
            // First write - just output
            process.stdout.write('\n' + output);
            this._linesWritten = true;
        }
    }

    async onTestRunEnd(testModules, errors) {
        // Remove signal handlers
        process.off('SIGINT', this._cleanup);
        process.off('SIGTERM', this._cleanup);
        this._progressStarted = false;

        // Clear the four progress lines if we wrote them
        if (this._linesWritten) {
            process.stdout.write('\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K\r');
            this._linesWritten = false;
        }

        // Call parent to print failure details and summary
        await super.onTestRunEnd(testModules, errors);
    }
}
