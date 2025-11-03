// @ts-nocheck
import { api } from '../slices/apiSlice';

// Re-export RTK Query hooks
export const {
    useLoadDecksQuery,
    useDeleteDeckMutation,
    useSaveAllianceDeckMutation,
    useSaveProphecyAssignmentsMutation,
    useSaveDeckMutation,
    useLoadStandaloneDecksQuery,
    useLoadDeckQuery
} = api;

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
    return (dispatch) => {
        dispatch(api.endpoints.loadDecks.initiate(options));
    };
}

export function loadDeck(deckId) {
    return (dispatch) => {
        dispatch(api.endpoints.loadDeck.initiate(deckId));
    };
}

export function selectDeck(deck) {
    return {
        type: 'SELECT_DECK',
        deck: deck
    };
}

export function deleteDeck(deck) {
    return (dispatch) => {
        dispatch(api.endpoints.deleteDeck.initiate(deck.id));
    };
}

export function saveDeck(deck) {
    return (dispatch) => {
        dispatch(api.endpoints.saveDeck.initiate(deck));
    };
}

export function saveAllianceDeck(deck) {
    return (dispatch) => {
        dispatch(api.endpoints.saveAllianceDeck.initiate(deck));
    };
}

export function clearDeckStatus() {
    return {
        type: 'CLEAR_DECK_STATUS'
    };
}

export function loadStandaloneDecks() {
    return (dispatch) => {
        dispatch(api.endpoints.loadStandaloneDecks.initiate());
    };
}

export function saveProphecyAssignments(deck, assignments) {
    return (dispatch) => {
        dispatch(api.endpoints.saveProphecyAssignments.initiate({ deckId: deck.id, assignments }));
    };
}
