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
        default:
            return state;
    }
}

export default chat;
