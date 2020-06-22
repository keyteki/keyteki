import { Decks } from '../types';

/**
 * @typedef DeckFilter
 * @property {string} name
 * @property {string} value
 */

/**
 * @typedef PagingOptions
 * @property {number} [pageSize] The number of elements in each page
 * @property {number} [page] The page index
 * @property {string} [sort] The sort column
 * @property {string} [sortDir] The sort direction
 * @property {DeckFilter[]} [filter] The filters
 */

/**
 * @param {PagingOptions} options
 */
export function loadDecks(options = {}) {
    return {
        types: [Decks.RequestDecks, Decks.DecksReceived],
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
        types: [Decks.DeleteDeck, Decks.DeckDeleted],
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
