var account = require('./account.js');
var decks = require('./decks.js');

module.exports.init = function(server) {
    account.init(server);
    decks.init(server);
};
