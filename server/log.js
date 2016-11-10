const winston = require('winston');

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({ json: false, timestamp: true }),
        new winston.transports.File({ filename: __dirname + '/logs/throneteki.log', json: false, timestamp: true })
    ]
});

module.exports = logger;
