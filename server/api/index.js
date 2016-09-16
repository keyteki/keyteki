var account = require('./account.js');
var decks = require('./decks.js');
var cards = require('./cards.js');

module.exports.init = function(server) {
    account.init(server);
    decks.init(server);
    cards.init(server);
};
