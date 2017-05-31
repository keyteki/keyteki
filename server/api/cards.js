const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/ringteki');
const logger = require('./../log.js');

module.exports.init = function(server) {
    server.get('/api/cards', function(req, res, next) {
        db.collection('cards').find({}).toArray(function(err, data) {
            if(err) {
                logger.info(err);
                return next(err);
            }

            res.send({ success: true, cards: data });
        });
    });

    server.get('/api/packs', function(req, res, next) {
        db.collection('packs').find({}).toArray(function(err, data) {
            if(err) {
                logger.info(err);
                return next(err);
            }

            res.send({ success: true, packs: data });
        });
    });

};
