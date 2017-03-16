export default function(state = {}, action) {
    switch(action.type) {
        case 'SOCKET_CONNECTED':
            return Object.assign({}, state, {
                socket: action.socket
            });        
        case 'GAME_SOCKET_CONNECTED':
            return Object.assign({}, state, {
                gameSocket: action.socket
            });
        case 'GAME_SOCKET_CONNECTING':
            return Object.assign({}, state, {
                gameConnecting: true,
                gameHost: action.host
            });
    }

    return state;
}
