const FailureLimiter = require('../../server/FailureLimiter');

describe('FailureLimiter', function () {
    let limiter;

    beforeEach(function () {
        vi.useFakeTimers();
        limiter = new FailureLimiter(3, 1000);
    });

    afterEach(function () {
        clearInterval(limiter.pruneTimer);
        vi.useRealTimers();
    });

    it('blocks a key once it reaches the failure limit', function () {
        limiter.recordFailure('1.2.3.4');
        limiter.recordFailure('1.2.3.4');
        expect(limiter.isBlocked('1.2.3.4')).toBe(false);

        limiter.recordFailure('1.2.3.4');
        expect(limiter.isBlocked('1.2.3.4')).toBe(true);
        expect(limiter.isBlocked('5.6.7.8')).toBe(false);
    });

    it('unblocks a key after the window passes', function () {
        limiter.recordFailure('1.2.3.4');
        limiter.recordFailure('1.2.3.4');
        limiter.recordFailure('1.2.3.4');

        vi.advanceTimersByTime(1001);

        expect(limiter.isBlocked('1.2.3.4')).toBe(false);
    });

    it('clears failures on reset', function () {
        limiter.recordFailure('1.2.3.4');
        limiter.recordFailure('1.2.3.4');
        limiter.recordFailure('1.2.3.4');

        limiter.reset('1.2.3.4');

        expect(limiter.isBlocked('1.2.3.4')).toBe(false);
    });
});
