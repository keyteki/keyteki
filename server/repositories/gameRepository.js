const mongoskin = require('mongoskin');
const logger = require('../log.js');

class GameRepository {
    save(game, callback) {
        var db = mongoskin.db('mongodb://127.0.0.1:27017/throneteki');

        if(!game.id) {
            db.collection('games').insert(game, function(err, result) {
                if(err) {
                    logger.info(err.message);

                    callback(err);

                    return;
                }

                callback(undefined, result.ops[0]._id);
            });
        } else {
            db.collection('games').update({ _id: mongoskin.helper.toObjectID(game.id) }, {
                '$set': {
                    startedAt: game.startedAt,
                    players: game.playersAndSpectators,
                    winner: game.winner,
                    winReason: game.winReason,
                    finishedAt: game.finishedAt
                }
            });
        }
    }
}

module.exports = GameRepository;

