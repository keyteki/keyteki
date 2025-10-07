import * as account from './account.js';
import * as decks from './decks.js';
import * as games from './games.js';
import * as cards from './cards.js';
import * as news from './news.js';
import * as user from './user.js';
import * as messages from './messages.js';
import * as banlist from './banlist.js';
import * as challonge from './challonge.js';

export function init(server, options) {
    account.init(server, options);
    decks.init(server);
    games.init(server);
    cards.init(server);
    news.init(server);
    user.init(server);
    messages.init(server);
    banlist.init(server);
    challonge.init(server);
}
