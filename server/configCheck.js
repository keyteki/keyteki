const logger = require('./log');

// The placeholder values shipped in config/default.json5, as [section, key, default]
const Secrets = {
    secret: [undefined, 'secret', 'somethingverysecret'],
    hmacSecret: ['lobby', 'hmacSecret', 'somethingevenmoresecret']
};

/**
 * Refuses to start a production process whose signing secrets are missing or still set to the
 * shipped defaults, since anyone could then forge auth tokens. Outside production it only warns.
 * @param {import('./services/ConfigService')} configService
 * @param {string[]} names which of the secrets this process uses
 */
function checkSecrets(configService, names = Object.keys(Secrets)) {
    const problems = names
        .filter((name) => {
            const [section, key, defaultValue] = Secrets[name];
            const value = section
                ? configService.getValueForSection(section, key)
                : configService.getValue(key);

            return !value || value === defaultValue;
        })
        .map((name) => `'${name}' is not set or is using the default value`);

    if (problems.length === 0) {
        return;
    }

    if (process.env.NODE_ENV === 'production' || configService.getValue('env') === 'production') {
        for (const problem of problems) {
            logger.error(`Insecure configuration: ${problem}`);
        }

        throw new Error('Refusing to start with insecure secrets in production');
    }

    for (const problem of problems) {
        logger.warn(`Insecure configuration: ${problem}. Do not use this config in production`);
    }
}

module.exports = { checkSecrets };
