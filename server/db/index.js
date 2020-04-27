const { Pool } = require('pg');
const ConfigService = require('../services/ConfigService');
const logger = require('../log');

const configService = new ConfigService();

const pool = new Pool({
    user: configService.getValue('dbUser'),
    host: configService.getValue('dbHost'),
    database: configService.getValue('dbDatabase'),
    password: configService.getValue('dbPassword'),
    port: configService.getValue('dbPort')
});

module.exports = {
    query: async (text, params) => {
        const start = Date.now();

        let res = await pool.query(text, params);

        const duration = Date.now() - start;
        logger.info('executed query', { text, duration, rows: res.rowCount });

        return res.rows;
    }
};

