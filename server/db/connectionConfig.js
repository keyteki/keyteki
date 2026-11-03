/**
 * The pg connection settings from the lobby config
 * @param {import('../services/ConfigService')} configService
 */
function getConnectionConfig(configService) {
    const host = configService.getValue('dbHost');
    const database = configService.getValue('dbDatabase');

    if (!host || !database) {
        throw new Error("Postgres is not configured, set 'dbHost' and 'dbDatabase'");
    }

    return {
        host,
        port: configService.getValue('dbPort') || 5432,
        database,
        user: configService.getValue('dbUser'),
        password: configService.getValue('dbPassword')
    };
}

module.exports = { getConnectionConfig };
