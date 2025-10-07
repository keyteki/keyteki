import winston from 'winston';
const { createLogger, format, transports } = winston;

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
        })
    ]
});

export default logger;
