// @ts-nocheck
const { cardCamel } = require('./chat-utils.js');

/**
 * Shared implementation of the `setupTest` helper used by both the vitest
 * integration helper (`integrationhelper.js`) and the scenario runner
 * (`server/devtools/scenario/runner.js`). Keeping the body in one place
 * ensures the two surfaces can't silently drift apart when new player fields
 * or initialisation steps are added.
 *
 * @param {Object} options - test setup options (player1/player2 state, phase, gameFormat)
 * @param {Object} ctx
 * @param {Object} ctx.game - the Game instance
 * @param {Object} ctx.player1 - PlayerInteractionWrapper for player 1
 * @param {Object} ctx.player2 - PlayerInteractionWrapper for player 2
 * @param {Function} ctx.startGame - starts the game (initialise + first-player prompts)
 * @param {Function} ctx.keepCards - keeps starting hand for both players
 * @param {Object} ctx.deckBuilder - DeckBuilder instance
 * @param {Object} ctx.cardRegistry - object that receives camel-cased card refs
 * @param {Function} [ctx.prepareDeck] - optional hook called with (deck, playerIndex) before selectDeck
 * @param {string[]} [ctx.playerNames] - optional default player names assigned to options.playerN.name
 */
function applySetupTest(options, ctx) {
    const { game, player1, player2, startGame, keepCards, deckBuilder, cardRegistry } = ctx;

    if (!options.player1) options.player1 = {};
    if (!options.player2) options.player2 = {};

    if (options.gameFormat) {
        game.gameFormat = options.gameFormat;
    }

    if (ctx.playerNames) {
        if (!options.player1.name) options.player1.name = ctx.playerNames[0];
        if (!options.player2.name) options.player2.name = ctx.playerNames[1];
    }

    const player1Deck = deckBuilder.customDeck(options.player1);
    const player2Deck = deckBuilder.customDeck(options.player2);
    if (ctx.prepareDeck) {
        ctx.prepareDeck(player1Deck, 0);
        ctx.prepareDeck(player2Deck, 1);
    }
    player1.selectDeck(player1Deck);
    player2.selectDeck(player2Deck);

    // Set chains before game start so they affect the first-player draw
    if (options.player1.setupChains) {
        player1.player.chains = options.player1.setupChains;
    }
    if (options.player2.setupChains) {
        player2.player.chains = options.player2.setupChains;
    }

    startGame();
    keepCards();

    if (options.phase !== 'setup') {
        player1.clickPrompt(player1.currentButtons[0]);
        player1.endTurn();
        player2.clickPrompt(player2.currentButtons[0]);
        player2.endTurn();
        if (options.player1.house) {
            player1.clickPrompt(options.player1.house);
        }
    }

    player1.amber = options.player1.amber;
    player2.amber = options.player2.amber;
    player1.keys = options.player1.keys;
    player2.keys = options.player2.keys;
    player1.chains = options.player1.chains;
    player2.chains = options.player2.chains;
    player1.token = options.player1.token;
    player2.token = options.player2.token;

    player1.hand = [];
    player2.hand = [];
    player1.inPlay = options.player1.inPlay;
    player2.inPlay = options.player2.inPlay;
    player1.hand = options.player1.hand;
    player2.hand = options.player2.hand;
    player1.discard = options.player1.discard;
    player2.discard = options.player2.discard;
    player1.archives = options.player1.archives;
    player2.archives = options.player2.archives;

    for (const player of [player1, player2]) {
        const cards = ['inPlay', 'hand', 'discard', 'archives'].reduce(
            (array, location) => array.concat(player[location]),
            []
        );
        for (const card of cards) {
            const camel = cardCamel(card.isToken() ? card.tokenCard() : card);
            if (!cardRegistry[camel]) {
                cardRegistry[camel] = card;
            }
        }
        for (const prophecy of player.player.prophecyCards) {
            const camel = cardCamel(prophecy);
            if (!cardRegistry[camel]) {
                cardRegistry[camel] = prophecy;
            }
        }
    }

    game.checkGameState(true);
}

module.exports = { applySetupTest };
