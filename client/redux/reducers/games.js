function games(state = {}, action) {
    let newState = Object.assign({}, state);

    switch (action.type) {
        case 'GAME_SOCKET_CONNECTED':
            newState.socket = action.socket;
            newState.connecting = false;
            newState.connected = true;

            break;
        case 'GAME_SOCKET_CONNECTING':
            newState.connecting = true;
            newState.connected = false;
            newState.gameHost = action.host;

            break;
        case 'GAME_SOCKET_CONNECT_FAILED':
            newState.connecting = false;
            newState.connected = false;
            newState.gameHost = undefined;

            break;
        case 'GAME_SOCKET_DISCONNECTED':
            newState.connecting = false;
            newState.connected = false;

            break;
        case 'GAME_SOCKET_RECONNECTING':
            newState.connecting = true;
            newState.connected = false;

            break;
        case 'GAME_SOCKET_RECONNECTED':
            newState.connecting = false;
            newState.connected = true;

            break;
        case 'GAME_SOCKET_CLOSED':
            newState.connected = false;
            newState.connecting = false;
            newState.gameHost = undefined;
            newState.socket = undefined;

            break;
        case 'HANDOFF_RECEIVED':
            newState.gameId = action.details.gameId;

            break;
        case 'RECEIVE_USERGAMES':
            newState.games = action.response.games;

            break;
        case 'GAME_SOCKET_RESPONSE_TIME_RECEIVED':
            newState.responseTime = action.responseTime;

            break;
        default:
            return state;
    }

    return newState;
}

export default games;
