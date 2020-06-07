export function loadCards() {
    return {
        types: ['REQUEST_CARDS', 'RECEIVE_CARDS'],
        shouldCallAPI: (state) => {
            return !state.cards.cards || state.cards.cards.length === 0;
        },
        APIParams: { url: '/api/cards', cache: false }
    };
}

export function loadFactions() {
    return {
        types: ['REQUEST_FACTIONS', 'RECEIVE_FACTIONS'],
        shouldCallAPI: (state) => {
            return !state.cards.factions;
        },
        APIParams: { url: '/api/factions', cache: false }
    };
}
