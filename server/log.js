const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');

if(!fs.existsSync(__dirname + '/logs/')) {
    fs.mkdirSync(__dirname + '/logs/');
}

let rotate = new (winston.transports.DailyRotateFile)({
    filename: __dirname + '/logs/keyteki',
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
