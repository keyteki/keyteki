const runServer = require('./server');
const logger = require('./server/log');

runServer()
    .then(() => {
        logger.info('Server finished startup');
    })
    .catch((err) => {
        logger.error('Server crashed', err);
    });
