const path = require('node:path');

const {
    inspectScenario,
    loadScenario,
    SCENARIO_BREAK
} = require('../../../server/devtools/scenario/runner.js');
const logger = require('../../../server/log.js');

const FIXTURE = path.join(__dirname, 'fixtures', 'sample.scenario.js');

describe('scenario/runner', function () {
    beforeEach(function () {
        // loadScenario emits warn() when it auto-picks a test from a
        // multi-test file or matches multiple by fragment. The tests below
        // exercise both paths intentionally; silence the noise.
        vi.spyOn(logger, 'warn').mockImplementation(() => {});
    });
    describe('inspectScenario', function () {
        it('lists tests with describe/it labels joined by " > "', function () {
            const { tests } = inspectScenario(FIXTURE);
            const names = tests.map((t) => t.fullName);

            expect(names).toContain('outer > runs setupTest');
            expect(names).toContain('outer > inner > inherits hooks and uses setupTest');
            expect(names).toContain('other suite > also uses setupTest');
        });

        it('filters out tests that never call setupTest', function () {
            const { tests } = inspectScenario(FIXTURE);
            const names = tests.map((t) => t.fullName);

            expect(names).not.toContain('outer > inner > skipped from picker (no setupTest)');
        });
    });

    describe('loadScenario', function () {
        it('returns a function that runs hooks then the test body', function () {
            const fn = loadScenario(`${FIXTURE}#runs setupTest`);
            const context = {
                setupTest: () => {}
            };
            fn.call(context);

            expect(context.outerHook).toBe(true);
            expect(context.body).toBe('outer');
        });

        it('runs nested beforeEach hooks in outer-to-inner order', function () {
            const fn = loadScenario(`${FIXTURE}#inherits hooks`);
            const context = { setupTest: () => {} };
            fn.call(context);

            expect(context.outerHook).toBe(true);
            expect(context.innerHook).toBe(true);
            expect(context.body).toBe('inner');
        });

        it('does case-insensitive substring match on the joined test name', function () {
            const fn = loadScenario(`${FIXTURE}#INHERITS HOOKS`);
            const context = { setupTest: () => {} };
            fn.call(context);
            expect(context.body).toBe('inner');
        });

        it('throws with the available test list when no test matches', function () {
            expect(() => loadScenario(`${FIXTURE}#does-not-exist`)).toThrow(
                /No test matching "does-not-exist".*Available:[\s\S]*runs setupTest/
            );
        });

        it('picks the first test when no fragment is given', function () {
            const fn = loadScenario(FIXTURE);
            const context = { setupTest: () => {} };
            fn.call(context);
            // The fixture's first registered it() is "outer > runs setupTest".
            expect(context.body).toBe('outer');
        });

        it('propagates SCENARIO_BREAK from the test body', function () {
            const fn = loadScenario(`${FIXTURE}#runs setupTest`);
            const context = {
                setupTest: () => {
                    throw SCENARIO_BREAK;
                }
            };
            let caught;
            try {
                fn.call(context);
            } catch (e) {
                caught = e;
            }
            expect(caught).toBe(SCENARIO_BREAK);
        });
    });
});
