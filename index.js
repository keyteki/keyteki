import runServer from './server/index.js';
import logger from './server/log.js';

runServer()
    .then(() => {
        logger.info('Server finished startup');
    })
    .catch((err) => {
        logger.error('Server crashed', err);
    });
