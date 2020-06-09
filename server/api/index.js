const account = require('./account');
const decks = require('./decks');
const games = require('./games');
const cards = require('./cards');
const news = require('./news');
const user = require('./user');
const messages = require('./messages');
const banlist = require('./banlist');
const challonge = require('./challonge');

module.exports.init = function (server, options) {
    account.init(server, options);
    decks.init(server);
    games.init(server);
    cards.init(server);
    news.init(server);
    user.init(server);
    messages.init(server);
    banlist.init(server);
    challonge.init(server);
};
