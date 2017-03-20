const logger = require('../log.js');

const BaseRepository = require('./baseRepository.js');

class GameRepository extends BaseRepository {
    create(game) {
        return this.db.collection('games').insert(game, (err) => {
            if(err) {
                logger.error(err);
            }
        });
    }

    update(game) {
        return this.db.collection('games').update({ gameId: game.gameId }, {
            '$set': {
                startedAt: game.startedAt,
                players: game.players,
                winner: game.winner,
                winReason: game.winReason,
                finishedAt: game.finishedAt
            }
        }, (err) => {
            if(err) {
                logger.error(err);
            }
        });
    }
}

module.exports = GameRepository;

