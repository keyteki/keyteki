const monk = require('monk');

class GameRepository {
    constructor(dbPath) {
        var db = monk(dbPath);
        this.games = db.get('games');
    }

    create(game) {
        return this.games.insert(game);
    }

    update(game) {
        return this.games.update({ gameId: game.gameId }, {
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

