import $ from 'jquery';

export function navigate(path) {
    return {
        type: 'NAVIGATE',
        newPath: path
    };
}

export function register() {
    return {
        type: 'AUTH_REGISTER'
    };
}

export function login() {
    return {
        type: 'AUTH_LOGIN'
    };
}

export function logout() {
    return {
        type: 'AUTH_LOGOUT'
    };
}

export function requestCards() {
    return {
        type: 'REQUEST_CARDS'
    };
}

export function receiveCards(cards) {
    return {
        type: 'RECEIVE_CARDS',
        cards: cards
    };
}

export function fetchCards() {
    return dispatch => {
        dispatch(requestCards());

        return $.ajax('/api/cards')
            .done(function(data) {
                dispatch(receiveCards(data.cards));
            });
    };
}

export function requestPacks() {
    return {
        type: 'REQUEST_PACK'
    };
}

export function receivePacks(packs) {
    return {
        type: 'RECEIVE_PACKS',
        packs: packs
    };
}

export function fetchPacks() {
    return dispatch => {
        dispatch(requestPacks());

        return $.ajax('/api/packs')
            .done(function(data) {
                dispatch(receivePacks(data.packs));
            });
    };
}
