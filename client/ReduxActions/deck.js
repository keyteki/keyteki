import $ from 'jquery';
import _ from 'underscore';

export function loadDecks() {
    return {
        types: ['REQUEST_DECKS', 'RECEIVE_DECKS'],
        shouldCallAPI: (state) => {
            return state.cards.singleDeck || !state.cards.decks;
        },
        callAPI: () => $.ajax('/api/decks', { cache: false })
    };
}

export function loadDeck(deckId) {
    return {
        types: ['REQUEST_DECK', 'RECEIVE_DECK'],
        shouldCallAPI: (state) => {
            let ret = !_.any(state.cards.decks, deck => {
                return deck._id === deckId;
            });

            return ret;
        },
        callAPI: () => $.ajax('/api/decks/' + deckId, { cache: false })
    };
}

export function selectDeck(deck) {
    return {
        type: 'SELECT_DECK',
        deck: deck
    };
}

export function addDeck() {
    return {
        type: 'ADD_DECK'
    };
}

export function updateDeck(deck) {
    return {
        type: 'UPDATE_DECK',
        deck: deck
    };
}

export function deleteDeck(deck) {
    return {
        types: ['DELETE_DECK', 'DECK_DELETED'],
        shouldCallAPI: () => true,
        callAPI: () => $.ajax({
            url: '/api/decks/' + deck._id,
            type: 'DELETE'
        })
    };
}

export function saveDeck(deck) {
    let str = JSON.stringify({
        deckName: deck.name,
        faction: { name: deck.faction.name, value: deck.faction.value },
        alliance: { name: deck.alliance.name, value: deck.alliance.value },
        stronghold: formatCards(deck.stronghold),
        provinceCards: formatCards(deck.provinceCards),
        conflictCards: formatCards(deck.conflictCards),
        dynastyCards: formatCards(deck.dynastyCards)
    });

    return {
        types: ['SAVE_DECK', 'DECK_SAVED'],
        shouldCallAPI: () => true,
        callAPI: () => $.ajax({
            url: '/api/decks/' + (deck._id || ''),
            type: deck._id ? 'PUT' : 'POST',
            data: { data: str }
        })
    };
}

export function clearDeckStatus() {
    return {
        type: 'CLEAR_DECK_STATUS'
    };
}

function formatCards(cards) {
    return _.map(cards, card => {
        return { card: { code: card.card.code }, count: card.count };
    });
}
