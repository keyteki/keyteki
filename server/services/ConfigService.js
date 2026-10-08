const config = require('config');
const logger = require('../log.js');

class ConfigService {
    constructor() {
        if (
            process.env.NODE_ENV === 'production' &&
            (typeof config.secret !== 'string' ||
                !config.secret.trim() ||
                config.secret.trim() === 'somethingverysecret')
        ) {
            throw new Error('Configure a unique secret before starting in production.');
        }
    }

    getValue(key) {
        if (!config[key]) {
            logger.warn(`Asked for config value '${key}', but it was not configured`);
        }

        return config[key];
    }

    getValueForSection(section, key) {
        if (!config[section]) {
            logger.warn(`Asked for config section '${section}', but it was not configured`);
        }

        if (!config[section][key]) {
            logger.warn(
                `Asked for config value '${key}' from section '${section}', but it was not configured`
            );
        }

        return config[section][key];
    }
}

module.exports = ConfigService;
