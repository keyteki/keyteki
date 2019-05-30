export default function (state = {}, action) {
    switch(action.type) {
        case 'RECEIVE_FINDUSER':
            return Object.assign({}, state, {
                currentUser: action.response.user
            });
        case 'SAVE_USER':
            return Object.assign({}, state, {
                userSaved: false
            });
        case 'USER_SAVED':
            return Object.assign({}, state, {
                userSaved: true
            });
        case 'DECK_VERIFIED':
            return Object.assign({}, state, {
                deckVerified: action.response.deckId
            });
        case 'DECKS_VERIFIED':
            return Object.assign({}, state, {
                decksVerified: true
            });
        case 'CLEAR_USER_STATUS':
            return Object.assign({}, state, {
                userSaved: false,
                deckVerified: undefined,
                decksVerified: false
            });
        case 'NODE_STATUS_RECEIVED':
            return Object.assign({}, state, {
                nodeStatus: action.status
            });
    }

    return state;
}
