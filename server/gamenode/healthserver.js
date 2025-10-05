const http = require('http');
const logger = require('../log.js');

class HealthServer {
    constructor(gameServer, port = 9000) {
        this.gameServer = gameServer;
        this.port = port;
        this.isDraining = false;
        this.server = null;
        this.drainCheckInterval = null;

        this.setupSignalHandlers();
    }

    setupSignalHandlers() {
        process.on('SIGTERM', () => {
            logger.info('Received SIGTERM - starting graceful shutdown');
            this.startDraining();
        });
    }

    startDraining() {
        if (this.isDraining) {
            return;
        }

        this.isDraining = true;
        logger.info('Node is now draining - will not accept new games');

        if (this.gameServer && this.gameServer.gameSocket) {
            this.gameServer.gameSocket.setDraining(true);
        }

        this.drainCheckInterval = setInterval(() => {
            const numGames = this.getNumGames();
            logger.info(`Draining: ${numGames} games still active`);

            if (numGames === 0) {
                logger.info('All games finished. Shutting down now.');
                clearInterval(this.drainCheckInterval);
                process.exit(0);
            }
        }, 10000);

        setTimeout(() => {
            logger.warn('Drain timeout (90 minutes) exceeded. Forcing shutdown.');
            clearInterval(this.drainCheckInterval);
            process.exit(1);
        }, 90 * 60 * 1000);
    }

    start() {
        this.server = http.createServer((req, res) => {
            const url = req.url;

            if (url === '/health/alive') {
                this.handleAlive(res);
            } else if (url === '/health/ready') {
                this.handleReady(res);
            } else if (url === '/health/games') {
                this.handleGames(res);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            }
        });

        this.server.listen(this.port, () => {
            logger.info(`Health check server listening on port ${this.port}`);
        });
    }

    handleAlive(res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                status: 'alive',
                uptime: process.uptime()
            })
        );
    }

    handleReady(res) {
        const isReady = !this.isDraining;
        const statusCode = isReady ? 200 : 503;

        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                ready: isReady,
                draining: this.isDraining,
                numGames: this.getNumGames()
            })
        );
    }

    handleGames(res) {
        const numGames = this.getNumGames();

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(String(numGames));
    }

    getNumGames() {
        if (!this.gameServer || !this.gameServer.games) {
            return 0;
        }
        return Object.keys(this.gameServer.games).length;
    }

    stop() {
        if (this.drainCheckInterval) {
            clearInterval(this.drainCheckInterval);
        }
        if (this.server) {
            this.server.close();
        }
    }
}

module.exports = HealthServer;
