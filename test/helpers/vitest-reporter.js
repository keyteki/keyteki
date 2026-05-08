/**
 * Minimal vitest reporter that shows progress without verbosity.
 * Displays a running tally of files and tests, delegates failure output to DefaultReporter.
 */

import { DefaultReporter } from 'vitest/reporters';

export default class CustomReporter extends DefaultReporter {
    constructor(options) {
        super({ ...options, summary: false });
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
        const state = typeof module.state === 'function' ? module.state() : module.state;
        if (state === 'passed') {
            this.filesPassed++;
        } else if (state === 'failed') {
            this.filesFailed++;
        } else if (state === 'skipped') {
            this.filesSkipped++;
        } else {
            this.filesFailed++;
        }
        this._printProgress();
    }

    // Override to suppress individual test output
    onTestCaseReady() {}

    onTestCaseResult(testCase) {
        const result = typeof testCase.result === 'function' ? testCase.result() : testCase.result;
        const state = result?.state ?? testCase.state;
        if (state === 'passed') {
            this.testsPassed++;
        } else if (state === 'failed') {
            this.testsFailed++;
            this._printFailure(testCase);
        } else if (state === 'skipped') {
            this.testsSkipped++;
        } else {
            this.testsFailed++;
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

        const result = typeof testCase.result === 'function' ? testCase.result() : testCase.result;
        const errors = result?.errors || testCase.errors;
        if (errors && errors.length > 0) {
            for (const error of errors) {
                const message = error.message || String(error);
                console.log(`  ${dim}${message}${reset}`);
            }
        }

        console.log('');
        // Re-print the 4 progress lines
        process.stdout.write('\n\n\n\n');
    }

    _printProgress(force = false) {
        // Skip all progress updates in DEBUG_TEST mode to keep output stable
        if (process.env.DEBUG_TEST) {
            return;
        }

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
        const fileStats = [
            this.filesFailed > 0 ? `${bold}${red}${this.filesFailed} failed${reset}` : null,
            `${bold}${green}${this.filesPassed} passed${reset}`,
            this.filesSkipped > 0 ? `${bold}${yellow}${this.filesSkipped} skipped${reset}` : null
        ]
            .filter(Boolean)
            .join(' | ');

        const testsTotal = this.testsPassed + this.testsFailed + this.testsSkipped;
        const testStats = [
            this.testsFailed > 0 ? `${bold}${red}${this.testsFailed} failed${reset}` : null,
            `${bold}${green}${this.testsPassed} passed${reset}`,
            this.testsSkipped > 0 ? `${bold}${yellow}${this.testsSkipped} skipped${reset}` : null
        ]
            .filter(Boolean)
            .join(' | ');

        const startAt = new Date(this.startTime).toLocaleTimeString('en-US', { hour12: false });
        const elapsedMs = Date.now() - this.startTime;
        const elapsed = elapsedMs >= 1000 ? `${(elapsedMs / 1000).toFixed(2)}s` : `${elapsedMs}ms`;
        const output =
            ` Test Files  ${fileStats} (${this.filesRun}/${this.filesExpected} ${filePercent}%)\n` +
            `      Tests  ${testStats} (${testsTotal})\n` +
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
        // Vitest invokes onTestRunEnd on each reporter, sometimes more than
        // once per run (e.g. if there are multiple projects or test contexts).
        // We only want to print the final summary once, and we want to skip
        // empty/no-op invocations entirely.
        const filesTotal = this.filesPassed + this.filesFailed + this.filesSkipped;
        const testsTotal = this.testsPassed + this.testsFailed + this.testsSkipped;
        if (this._summaryPrinted || (filesTotal === 0 && testsTotal === 0)) {
            return;
        }
        this._summaryPrinted = true;

        // Remove signal handlers
        process.off('SIGINT', this._cleanup);
        process.off('SIGTERM', this._cleanup);
        this._progressStarted = false;

        // Clear the four progress lines if we wrote them
        if (this._linesWritten) {
            process.stdout.write('\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K\x1b[1A\x1b[2K\r');
            this._linesWritten = false;
        }

        // Print our own final summary. We don't delegate to super's
        // onTestRunEnd because DefaultReporter relies on internal counters
        // populated by the per-test/per-module handlers we suppress for the
        // live progress display, so it would print "0 passed".
        const bold = '\x1b[1m';
        const reset = '\x1b[0m';
        const green = '\x1b[32m';
        const red = '\x1b[31m';
        const yellow = '\x1b[33m';

        const fileStats = [
            this.filesFailed > 0 ? `${bold}${red}${this.filesFailed} failed${reset}` : null,
            this.filesPassed > 0 ? `${bold}${green}${this.filesPassed} passed${reset}` : null,
            this.filesSkipped > 0 ? `${bold}${yellow}${this.filesSkipped} skipped${reset}` : null
        ]
            .filter(Boolean)
            .join(' | ');

        const testStats = [
            this.testsFailed > 0 ? `${bold}${red}${this.testsFailed} failed${reset}` : null,
            this.testsPassed > 0 ? `${bold}${green}${this.testsPassed} passed${reset}` : null,
            this.testsSkipped > 0 ? `${bold}${yellow}${this.testsSkipped} skipped${reset}` : null
        ]
            .filter(Boolean)
            .join(' | ');

        const startAt = new Date(this.startTime).toLocaleTimeString('en-US', { hour12: false });
        const elapsedMs = Date.now() - this.startTime;
        const elapsed = elapsedMs >= 1000 ? `${(elapsedMs / 1000).toFixed(2)}s` : `${elapsedMs}ms`;

        process.stdout.write(
            `\n Test Files  ${fileStats || '0'} (${filesTotal})\n` +
                `      Tests  ${testStats || '0'} (${testsTotal})\n` +
                `   Start at  ${startAt}\n` +
                `   Duration  ${elapsed}\n`
        );

        // Surface any unhandled errors collected by vitest itself.
        if (errors && errors.length > 0) {
            for (const error of errors) {
                console.error(error);
            }
        }
    }
}
