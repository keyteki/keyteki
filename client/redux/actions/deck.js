import { Decks } from '../types';

/**
 * @typedef PagingOptions
 * @property {number} pageSize
 * @property {number} page
 */

/**
 * @param {PagingOptions} options
 */
export function loadDecks(options = { page: 1, pageSize: 10 }) {
    return {
        types: ['REQUEST_DECKS', 'RECEIVE_DECKS'],
        shouldCallAPI: () => true,
        APIParams: { url: '/api/decks', cache: false, data: options }
    };
}

export function loadDeck(deckId) {
    return {
        types: ['REQUEST_DECK', 'RECEIVE_DECK'],
        shouldCallAPI: (state) => {
            let ret =
                state.cards.decks.length === 0 ||
                !state.cards.decks.some((deck) => {
                    return deck.id === deckId;
                });

            return ret;
        },
        APIParams: { url: `/api/decks/${deckId}`, cache: false }
    };
}

export function selectDeck(deck) {
    return {
        type: 'SELECT_DECK',
        deck: deck
    };
}

export function deleteDeck(deck) {
    return {
        types: ['DELETE_DECK', 'DECK_DELETED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/decks/${deck.id}`,
            type: 'DELETE'
        }
    };
}

export function saveDeck(deck) {
    let str = JSON.stringify({
        uuid: deck.uuid
    });

    return {
        types: [Decks.SaveDeck, Decks.DeckSaved],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/decks/',
            type: 'POST',
            data: str
        }
    };
}

export function clearDeckStatus() {
    return {
        type: 'CLEAR_DECK_STATUS'
    };
}

export function loadStandaloneDecks() {
    return {
        types: ['LOAD_STANDALONE_DECKS', 'STANDALONE_DECKS_LOADED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/standalone-decks',
            type: 'GET'
        }
    };
}
