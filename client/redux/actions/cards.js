export function loadCards() {
    return {
        types: ['REQUEST_CARDS', 'RECEIVE_CARDS'],
        shouldCallAPI: (state) => {
            return !state.cards.cards;
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
