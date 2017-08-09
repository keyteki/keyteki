export default function(state = {}, action) {
    switch(action.type) {
        case 'SOCKET_CONNECTED':
            return Object.assign({}, state, {
                socket: action.socket
            });
        case 'GAME_SOCKET_CONNECTED':
            return Object.assign({}, state, {
                gameSocket: action.socket,
                gameConnecting: false
            });
        case 'GAME_SOCKET_CONNECTING':
            return Object.assign({}, state, {
                gameConnecting: true,
                gameHost: action.host
            });
        case 'GAME_SOCKET_CONNECT_FAILED':
            return Object.assign({}, state, {
                gameConnecting: false,
                gameHost: undefined
            });
        case 'GAME_SOCKET_CLOSED':
            return Object.assign({}, state, {
                gameConnecting: false,
                gameHost: undefined,
                gameSocket: undefined
            });
    }

    return state;
}
