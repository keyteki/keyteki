export default function (state = { banlist: [] }, action) {
    switch (action.type) {
        case 'RECEIVE_FINDUSER':
            var user = action.response.user;
            if (user) {
                user.linkedAccounts = action.response.linkedAccounts;
            }

            return Object.assign({}, state, {
                currentUser: user
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
        case 'REQUEST_BANLIST':
            return Object.assign({}, state, {});
        case 'RECEIVE_BANLIST':
            return Object.assign({}, state, {
                banlist: action.response.banlist
            });
        case 'ADD_BANLIST':
            return Object.assign({}, state, {
                banlistAdded: false
            });
        case 'BANLIST_ADDED':
            return Object.assign({}, state, {
                banlistAdded: true,
                banlist: [action.response.entry, ...state.banlist]
            });
        case 'DELETE_BANLIST':
            return Object.assign({}, state, {
                banlistDeleted: false
            });
        case 'BANLIST_DELETED':
            return Object.assign({}, state, {
                banlistDeleted: true,
                banlist: state.banlist.filter((entry) => {
                    return entry.id !== action.response.id;
                })
            });
        case 'CLEAR_BANLIST_STATUS':
            return Object.assign({}, state, {
                banlistAdded: false,
                banlistSaved: false,
                banlistDeleted: false
            });
    }

    return state;
}
