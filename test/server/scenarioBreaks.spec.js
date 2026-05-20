const fs = require('fs');
const path = require('path');

const TEST_ROOT = path.resolve(__dirname);
const SELF = __filename;

function walk(dir) {
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...walk(full));
        } else if (entry.isFile() && full.endsWith('.spec.js') && full !== SELF) {
            out.push(full);
        }
    }
    return out;
}

describe('scenarioBreak()', function () {
    it('should not be left in committed test files', function () {
        const offenders = [];
        for (const file of walk(TEST_ROOT)) {
            const src = fs.readFileSync(file, 'utf8');
            const lines = src.split('\n');
            lines.forEach((line, i) => {
                // Match `this.scenarioBreak(` or bare `scenarioBreak(`, but
                // skip comments so the explanatory comment in this file (and
                // in scenarioRunner.js docs referenced elsewhere) is fine.
                const stripped = line.replace(/\/\/.*$/, '');
                if (/(?:^|[^.\w])(?:this\.)?scenarioBreak\s*\(/.test(stripped)) {
                    offenders.push(`${path.relative(TEST_ROOT, file)}:${i + 1}`);
                }
            });
        }
        if (offenders.length) {
            throw new Error(
                'Found stray scenarioBreak() calls — remove before committing:\n  ' +
                    offenders.join('\n  ')
            );
        }
    });
});
