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
        await deckBuilderService.create(req.user.username);

        res.send({success: true})
    }));
}