const _ = require('underscore');

const BaseRepository = require('./baseRepository.js');
const logger = require('../log.js');

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

    getAllGames(from, to, callback) {
        this.db.collection('games').find().toArray((err, games) => {
            if(err) {
                logger.error(err);

                if(callback) {
                    return callback(err);
                }

                return;
            }

            if(callback) {
                games = _.filter(games, game => {
                    return game.startedAt >= from && game.startedAt < to;
                });

                return callback(err, games);
            }
        });
    }
}

module.exports = GameRepository;

