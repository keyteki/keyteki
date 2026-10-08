/**
 * Tracks failed attempts per key (e.g. client IP) in memory and blocks a key once it
 * reaches the limit, until the window since its first failure has passed.
 */
class FailureLimiter {
    /**
     * @param {number} maxFailures
     * @param {number} windowMs
     */
    constructor(maxFailures, windowMs) {
        this.maxFailures = maxFailures;
        this.windowMs = windowMs;
        this.failures = new Map();

        this.pruneTimer = setInterval(() => this.prune(), windowMs);
        this.pruneTimer.unref();
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
    isBlocked(key) {
        const entry = this.getEntry(key);

        return !!entry && entry.count >= this.maxFailures;
    }

    /**
     * @param {string} key
     */
    recordFailure(key) {
        const entry = this.getEntry(key);

        if (entry) {
            entry.count++;
        } else {
            this.failures.set(key, { count: 1, expires: Date.now() + this.windowMs });
        }
    }

    /**
     * @param {string} key
     */
    reset(key) {
        this.failures.delete(key);
    }

    getEntry(key) {
        const entry = this.failures.get(key);

        if (entry && entry.expires <= Date.now()) {
            this.failures.delete(key);

            return undefined;
        }

        return entry;
    }

    prune() {
        const now = Date.now();

        for (const [key, entry] of this.failures) {
            if (entry.expires <= now) {
                this.failures.delete(key);
            }
        }
    }
}

module.exports = FailureLimiter;
