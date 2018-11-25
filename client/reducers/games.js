function games(state = {}, action) {
    switch(action.type) {
        case 'GAME_SOCKET_CONNECTED':
            return Object.assign({}, state, {
                socket: action.socket,
                connecting: false,
                connected: true
            });
        case 'GAME_SOCKET_CONNECTING':
            return Object.assign({}, state, {
                connecting: true,
                connected: false,
                gameHost: action.host
            });
        case 'GAME_SOCKET_CONNECT_FAILED':
            return Object.assign({}, state, {
                connecting: false,
                connected: false,
                gameHost: undefined
            });
        case 'GAME_SOCKET_DISCONNECTED':
            return Object.assign({}, state, {
                connecting: false,
                connected: false
            });
        case 'GAME_SOCKET_RECONNECTING':
            return Object.assign({}, state, {
                connecting: true,
                connected: false
            });
        case 'GAME_SOCKET_RECONNECTED':
            return Object.assign({}, state, {
                connecting: false,
                connected: true
            });
        case 'GAME_SOCKET_CLOSED':
            return Object.assign({}, state, {
                connected: false,
                connecting: false,
                gameHost: undefined,
                socket: undefined
            });
        case 'HANDOFF_RECEIVED':
            var newState = Object.assign({}, state, {
                gameId: action.details.gameId
            });

            return newState;
        default:
            return state;
    }
}

export default games;
