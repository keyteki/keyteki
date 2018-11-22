import _ from 'underscore';

export default function(state = {}, action) {
    switch(action.type) {
        case 'REFRESH_USER':
            return Object.assign({}, state, {
                user: action.user,
                username: action.user.username,
                token: action.token
            });
        case 'RECEIVE_BLOCKLIST':
            return Object.assign({}, state, {
                blockList: action.response.blockList
            });
        case 'BLOCKLIST_ADDED':
            var addedState = Object.assign({}, state, {
                blockListAdded: true
            });

            addedState.blockList.push(action.response.username);

            return addedState;
        case 'BLOCKLIST_DELETED':
            var blockList = _.reject(state.blockList, user => {
                return user === action.response.username;
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
    }

    return state;
}
