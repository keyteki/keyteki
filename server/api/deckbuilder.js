const monk = require('monk');
const passport = require('passport');

const DeckBuilderService = require('../services/DeckBuilderService.js');
const ConfigService = require('../services/ConfigService');
const { wrapAsync } = require('../util.js');

const configService = new ConfigService();

let db = monk(configService.getValue('dbPath'));
let deckBuilderService = new DeckBuilderService(db);

module.exports.init = function(server) {
    server.post('/api/decks/builder', passport.authenticate('jwt', {session:false}), wrapAsync(async function(req, res) {
        deckBuilderService.create(req.user.username).then(
            res.send({success: true})
        )
        .catch(
            res.send({success: false})
        );

    }));

    server.patch('/api/decks/builder/:id', passport.authenticate('jwt', {session:false}), wrapAsync(async function(req, res) {
        var selectedCards = deckBuilderService.addCard(req.user.username, req.params.id)
        res.send({success: true, selectedCards: selectedCards});

    }));
}