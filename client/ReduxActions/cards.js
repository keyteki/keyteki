import $ from 'jquery';

export function loadCards() {
    return {
        types: ['REQUEST_CARDS', 'RECEIVE_CARDS'],
        shouldCallAPI: (state) => {
            return !state.cards.cards;  
        },
        callAPI: () => $.ajax('/api/cards', { cache: false })
    };
}

export function loadPacks() {
    return {
        types: ['REQUEST_PACKS', 'RECEIVE_PACKS'],
        shouldCallAPI: (state) => {
            return !state.cards.packs;  
        },
        callAPI: () => $.ajax('/api/packs', { cache: false })
    };    
}

export function loadFactions() {
    return {
        types: ['REQUEST_FACTIONS', 'RECEIVE_FACTIONS'],
        shouldCallAPI: (state) => {
            return !state.cards.factions;  
        },
        callAPI: () => $.ajax('/api/factions', { cache: false })
    };
}
