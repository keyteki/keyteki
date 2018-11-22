const account = require('./account.js');
const decks = require('./decks.js');
const cards = require('./cards.js');
const news = require('./news.js');
const user = require('./user.js');

module.exports.init = function(server) {
    account.init(server);
    decks.init(server);
    cards.init(server);
    news.init(server);
    user.init(server);
};
