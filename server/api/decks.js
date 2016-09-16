const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/throneteki');
const logger = require('./../log.js');

module.exports.init = function(server) {
    server.get('/api/decks', function(req, res, next) {
        if(req.user) {
            db.collection('decks').find({ username: req.user.username }).toArray(function(err, data) {
                if(err) {
                    logger.info(err);
                    return next(err);
                }

                res.send({ success: true, decks: data });
            });
        } else {
            res.status(401).send({ message: 'Unauthorized' });
        }
    });
};
