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
    /**
     * @param {string} text
     * @param {any[]} params
     */
    query: async (text, params = []) => {
        logger.debug(text, params);
        let res = await pool.query(text, params);

        return res.rows;
    },
    queryTran: async (client, text, params = []) => {
        logger.debug(text, params);
        let res = await client.query(text, params);

        return res.rows;
    },
    startTransaction: async () => {
        let client = await pool.connect();

        try {
            await client.query('BEGIN');
        } catch (err) {
            client.release();

            throw err;
        }

        return client;
    },
    /**
     * Runs the callback inside a transaction on a single pooled connection, committing if it
     * succeeds and rolling back if it throws. Use queryTran with the client it is given.
     * @template T
     * @param {(client: import('pg').PoolClient) => Promise<T>} callback
     * @returns {Promise<T>}
     */
    transaction: async (callback) => {
        const client = await module.exports.startTransaction();

        try {
            const result = await callback(client);
            await client.query('COMMIT');

            return result;
        } catch (err) {
            await client.query('ROLLBACK');

            throw err;
        } finally {
            client.release();
        }
    },
    shutdown: async () => {
        await pool.end();
    }
};
