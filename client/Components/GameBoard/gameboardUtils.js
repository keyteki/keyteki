export const placeholderPlayer = {
    cardPiles: {
        cardsInPlay: [],
        discard: [],
        hand: [],
        purged: [],
        deck: []
    },
    activePlayer: false,
    numDeckCards: 0,
    stats: {
        keys: { red: false, blue: false, yellow: false }
    },
    houses: [],
    title: null,
    user: null,
    deckData: {}
};

export const normalizePlayer = (source) => {
    let player = Object.assign({}, placeholderPlayer, source);
    player.cardPiles = Object.assign({}, placeholderPlayer.cardPiles, player.cardPiles);
    return player;
};

export const getMatchRecord = (thisPlayer, otherPlayer) => ({
    thisPlayer: {
        name: thisPlayer.name,
        wins: thisPlayer.wins
    },
    otherPlayer: {
        name: otherPlayer.name ? otherPlayer.name : 'Noone',
        wins: otherPlayer.wins ? otherPlayer.wins : 0
    }
});

export const canShowDeckName = (currentGame, isMe) =>
    !((currentGame.gameFormat === 'sealed' && !isMe) || currentGame.hideDeckLists);

export const isSpectating = (currentGame, user) => !currentGame.players[user.username];
