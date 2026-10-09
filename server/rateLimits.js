const { rateLimit } = require('express-rate-limit');

const FifteenMinutes = 15 * 60 * 1000;
const OneHour = 60 * 60 * 1000;

/**
 * Per client IP request limits for unauthenticated account endpoints. Failed logins are tracked
 * separately by FailureLimiter, since those handlers reply 200 with success: false on failure.
 */
function createLimiter(windowMs, limit) {
    return rateLimit({
        windowMs,
        limit,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        handler: (req, res, next, options) => {
            res.status(options.statusCode).send({
                success: false,
                message: 'Too many attempts.  Please wait a while and try again'
            });
        }
    });
}

module.exports = {
    registerLimiter: createLimiter(OneHour, 20),
    accountTokenLimiter: createLimiter(FifteenMinutes, 10),
    lookupLimiter: createLimiter(FifteenMinutes, 60),
    refreshLimiter: createLimiter(FifteenMinutes, 120)
};
