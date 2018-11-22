function chat(state = {
    messages: []
}, action) {
    switch(action.type) {
        case 'RECEIVE_LOBBY_MSG':
            return Object.assign({}, state, {
                messages: [
                    ...state.messages, action.message
                ]
            });
        case 'RECEIVE_LOBBY_MSGS':
            return Object.assign({}, state, {
                messages: action.messages
            });
        case 'RECEIVE_BANNER_NOTICE':
            return Object.assign({}, state, {
                notice: action.notice
            });
        default:
            return state;
    }
}

export default chat;
