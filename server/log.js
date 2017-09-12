const winston = require('winston');
require('winston-daily-rotate-file');

let rotate = new (winston.transports.DailyRotateFile)({
    filename: __dirname + '/logs/ringteki',
    datePattern: '-yyyy-MM-dd.log',
    timestamp: true,
    json: false,
    zippedArchive: true
});

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({ json: false, timestamp: true }),
        rotate
    ]
});

module.exports = logger;
