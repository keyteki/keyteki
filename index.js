const runServer = require('./server');
const logger = require('./server/log');

// A stray rejected promise from a socket or HTTP handler should not take the whole lobby down
process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', reason);
});

runServer()
    .then(() => {
        logger.info('Server finished startup');
    })
    .catch((err) => {
        logger.error('Server crashed', err);
        process.exit(1);
    });
