const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');

if(!fs.existsSync(__dirname + '/logs/')) {
    fs.mkdirSync(__dirname + '/logs/');
}

let rotate = new transports.DailyRotateFile({
    filename: __dirname + '/logs/keyteki-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true
});

function rest(info) {
    const cleanedObject = Object.assign({}, info, {
        timestamp: undefined,
        level: undefined,
        message: undefined,
        splat: undefined,
        label: undefined
    });

    let str = '';

    for(let [key, value] of Object.entries(cleanedObject)) {
        if(!value) {
            continue;
        }

        str += `${key}=${value} `;
    }

    return str;
}

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.splat(),
        format.errors({ stack: true }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message} ${rest(info)}}`)
    ),
    transports: [
        new transports.Console({ format: format.combine(
            format.splat(),
            format.colorize(),
            format.timestamp(),
            format.errors({ stack: true }),
            format.printf(info => `${info.timestamp} ${info.level}: ${info.message} ${rest(info)}`)
        ) }),
        rotate
    ]
});

module.exports = logger;
