const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/throneteki');
const logger = require('./../log.js');

module.exports.init = function(server) {
    server.get('/api/decks', function(req, res, next) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        db.collection('decks').find({ username: req.user.username }).toArray(function(err, data) {
            if(err) {
                logger.info(err);
                return next(err);
            }

            res.send({ success: true, decks: data });
        });
    });

    server.post('/api/decks/new', function(req, res, next) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        var data = JSON.parse(req.body.data);

        db.collection('decks').insert({ 
            username: req.user.username, 
            name: data.deckName,
            plotCards: data.plotCards,
            drawCards: data.drawCards,
            faction: data.faction,
            agenda: data.agenda,
            lastUpdated: new Date()
        }, function(err) {
            if(err) {
                logger.info(err);
                return next(err);
            }

            res.send({ success: true });
        });
    });
};
