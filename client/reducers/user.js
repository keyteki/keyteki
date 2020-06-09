export default function (state = { blockList: [] }, action) {
    switch (action.type) {
        case 'RECEIVE_BLOCKLIST':
            return Object.assign({}, state, {
                blockList: action.response.blockList
            });
        case 'RECEIVE_SESSIONS':
            return Object.assign({}, state, {
                sessions: action.response.tokens
            });
        case 'REMOVE_SESSION':
            return Object.assign({}, state, {
                sessionRemoved: false
            });
        case 'SESSION_REMOVED':
            var sessions = state.sessions.filter((t) => {
                return t.id !== action.response.tokenId;
            });

            return Object.assign({}, state, {
                sessionRemoved: true,
                sessions: sessions
            });
        case 'BLOCKLIST_ADDED':
            var addedState = Object.assign({}, state, {
                blockListAdded: true
            });

            addedState.blockList.push(action.response.username);

            return addedState;
        case 'BLOCKLIST_DELETED':
            var blockList = state.blockList.filter((user) => {
                return user !== action.response.username;
            });

            return Object.assign({}, state, {
                blockListDeleted: true,
                blockList: blockList
            });
        case 'CLEAR_BLOCKLIST_STATUS':
            return Object.assign({}, state, {
                blockListAdded: false,
                blockListDeleted: false
            });
        case 'CLEAR_SESSION_STATUS':
            return Object.assign({}, state, {
                sessionRemoved: false
            });
        case 'SAVE_PROFILE':
            return Object.assign({}, state, {
                profileSaved: false
            });
        case 'PROFILE_SAVED':
            return Object.assign({}, state, {
                profileSaved: true
            });
        case 'CLEAR_PROFILE_STATUS':
            return Object.assign({}, state, {
                profileSaved: false
            });
    }

    return state;
}
