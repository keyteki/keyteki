const monk = require('monk');
const passport = require('passport');

const DeckBuilderService = require('../services/DeckBuilderService.js');
const ConfigService = require('../services/ConfigService');
const { wrapAsync } = require('../util.js');

const configService = new ConfigService();

let db = monk(configService.getValue('dbPath'));
let deckBuilderService = new DeckBuilderService(db);

module.exports.init = function(server) {
    server.put('/api/deckbuilder', passport.authenticate('jwt', {session:false}), wrapAsync(async function(req, res) {
        deckBuilderService.create(req.user.username).then(
            res.send({success: true})
        )
    }));

    server.patch('/api/deckbuilder', passport.authenticate('jwt', {session:false}), wrapAsync(async function(req, res) {
        var buildingDeck = deckBuilderService.addCard(req.user.username, req.body.cardId)
        res.send({ success: true, buildingDeck: buildingDeck });
    }));

    server.delete('/api/deckbuilder', passport.authenticate('jwt', {session:false}), wrapAsync(async function(req, res) {
        var buildingDeck = deckBuilderService.removeCard(req.user.username, req.body.cardId, req.body.count)
        res.send({success: true, buildingDeck: buildingDeck });
    }));

    server.get('/api/deckbuilder', passport.authenticate('jwt', {session:false}), wrapAsync(async function(req, res) {
        var deck = deckBuilderService.getDeck(req.user.username)
        res.send({success: true, deck: deck});
    }));

    server.post('/api/deckbuilder', passport.authenticate('jwt', {session:false}), wrapAsync(async function(req, res) {
        deckBuilderService.saveDeck(req.user.username, req.body.deckName);
        res.send({success: true});
    }));

}
