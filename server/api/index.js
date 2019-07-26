const account = require('./account');
const decks = require('./decks');
const cards = require('./cards');
const news = require('./news');
const user = require('./user');
const messages = require('./messages');

module.exports.init = function(server) {
    account.init(server);
    decks.init(server);
    cards.init(server);
    news.init(server);
    user.init(server);
    messages.init(server);
};
