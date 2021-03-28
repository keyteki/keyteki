const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');

if (!fs.existsSync(__dirname + '/logs/')) {
    fs.mkdirSync(__dirname + '/logs/');
}

let rotate = new transports.DailyRotateFile({
    filename: __dirname + '/logs/keyteki-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true
});

const prettyJson = format.printf((info) => {
    if (info.meta && info.meta instanceof Error) {
        info.message = `${info.message} ${info.meta.stack}`;
    } else if (typeof info.message === 'object') {
        info.message = JSON.stringify(info.message, null, 4);
    }

    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.prettyPrint(),
        format.splat(),
        format.simple(),
        prettyJson
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.timestamp(),
                format.errors({ stack: true }),
                format.colorize(),
                format.prettyPrint(),
                format.splat(),
                format.simple(),
                prettyJson
            )
        }),
        rotate
    ]
});

module.exports = logger;
