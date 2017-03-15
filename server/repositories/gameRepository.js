const config = require('../config.js');
const db = require('monk')(config.dbPath);
const games = db.get('games');

class GameRepository {
    create(game) {
        return games.insert(game);
    }

    update(game) {
        return games.update({ gameId: game.gameId }, {
            '$set': {
                startedAt: game.startedAt,
                players: game.players,
                winner: game.winner,
                winReason: game.winReason,
                finishedAt: game.finishedAt                
            }
        });
    }
}

module.exports = GameRepository;

