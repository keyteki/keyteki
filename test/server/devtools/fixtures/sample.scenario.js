// Fixture for scenario/runner.js tests. The runner dry-loads spec files using
// stubbed globals, so this file MUST NOT import anything heavy at top level —
// only declare describe/it/beforeEach structure and reference `setupTest` so
// the inspectScenario filter accepts the suites that need it.

describe('outer', function () {
    beforeEach(function () {
        this.outerHook = true;
    });

    it('runs setupTest', function () {
        this.setupTest({ player1: {}, player2: {} });
        this.body = 'outer';
    });

    describe('inner', function () {
        beforeEach(function () {
            this.innerHook = true;
        });

        it('inherits hooks and uses setupTest', function () {
            this.setupTest({});
            this.body = 'inner';
        });

        it('skipped from picker (no setupTest)', function () {
            this.body = 'helper';
        });
    });
});

describe('other suite', function () {
    it('also uses setupTest', function () {
        this.setupTest({});
    });
});
