/*
 * Scenario host: wires a running GameServer up to the scenario runner.
 *
 * Kept out of `server/gamenode/gameserver.js` so devtools-only plumbing
 * doesn't bloat production code paths. The host:
 *   1. Boots a scenario game on startup (`install`).
 *   2. Listens for SIGUSR2 from the dev CLI to rebuild the game in place
 *      without restarting the node (`r` hot-reload).
 *
 * The only `server` API surface used here is `server.games`,
 * `server.sendGameState(game)`, and a scratch field `server.scenarioGameId`.
 */

// @ts-nocheck

const logger = require('../../log.js');
const scenarioRunner = require('./runner.js');

/**
 * Build (or rebuild) a scenario-mode game on the given server.
 *
 * @param {object} server - GameServer-like host with `games` and `sendGameState`
 * @param {string} scenarioPath
 * @param {string} [reuseId]
 */
function bootstrap(server, scenarioPath, reuseId) {
    try {
        const game = scenarioRunner.runScenario(scenarioPath, {
            router: server,
            gameId: reuseId
        });

        // Tag the game so the client knows to auto-navigate to /play
        // whenever a scenario gamestate arrives (new spawn or `r` reset).
        game.scenario = true;

        game.on('onTimeExpired', () => {
            server.sendGameState(game);
        });

        server.games[game.id] = game;
        server.scenarioGameId = game.id;

        server.sendGameState(game);
        logger.info(`Scenario ready as game ${game.id}; log in as test0/test1 to join`);
        return game;
    } catch (err) {
        logger.error('Failed to bootstrap scenario:', err);
        throw err;
    }
}

/**
 * Rebuild the active scenario game in place, preserving the game id and any
 * open browser socket connections.
 *
 * @param {object} server
 * @param {import("../game/game")} oldGame
 */
function reset(server, oldGame) {
    if (!oldGame || !oldGame.scenarioPath) {
        return;
    }

    // Capture sockets keyed by username so we can re-attach them.
    const sockets = {};
    for (const player of Object.values(oldGame.getPlayersAndSpectators())) {
        if (player.socket) {
            sockets[player.name] = player.socket;
        }
    }

    // Don't detach the old game up-front: bootstrap may throw (e.g. the dev
    // saved a syntax error into the spec) and we'd rather keep the old game
    // alive so connected sockets aren't orphaned. bootstrap overwrites
    // server.games[reuseId] on success anyway.
    const newGame = bootstrap(server, oldGame.scenarioPath, oldGame.id);

    // Carry over the per-user diff baseline so the next sendGameState is a
    // diff from the client's current rootState (not a raw full state, which
    // the client would incorrectly try to apply as a diff and corrupt the
    // board).
    for (const [name, baseline] of Object.entries(oldGame.jsonForUsers || {})) {
        newGame.jsonForUsers[name] = baseline;
    }

    // Re-attach captured sockets to the freshly-built player records.
    for (const [name, socket] of Object.entries(sockets)) {
        const player = newGame.playersAndSpectators[name];
        if (!player) {
            continue;
        }
        player.lobbyId = player.id;
        player.id = socket.id;
        player.connectionSucceeded = true;
        player.socket = socket;
    }

    newGame.addAlert('warning', 'Scenario reset');
    server.sendGameState(newGame);
}

/**
 * One-call entry point used by gameserver startup: boot the scenario and
 * install the SIGUSR2 reset hook.
 *
 * @param {object} server
 * @param {string} scenarioPath
 */
function install(server, scenarioPath) {
    bootstrap(server, scenarioPath);

    // The CLI (npm run dev:scenario) sends SIGUSR2 when the dev presses "r"
    // to reset the scenario without restarting the node.
    process.on('SIGUSR2', () => {
        const game = server.scenarioGameId && server.games[server.scenarioGameId];
        if (!game) {
            logger.warn('SIGUSR2 received but no scenario game is active');
            return;
        }
        try {
            reset(server, game);
        } catch (err) {
            // bootstrap() inside reset() may throw if the spec file has a
            // syntax/runtime error. Log and keep the old game (and its
            // sockets) alive so the dev can fix the spec and try again.
            logger.error('Scenario reset failed; keeping previous game:', err);
            game.addAlert('danger', `Scenario reset failed: ${err.message}`);
            server.sendGameState(game);
        }
    });
}

module.exports = { install, bootstrap, reset };
