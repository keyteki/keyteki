export function socketConnected(socket) {
    return {
        type: 'SOCKET_CONNECTED',
        socket: socket
    };
}

export function socketMessageSent(message) {
    return {
        type: 'SOCKET_MESSAGE_SENT',
        message: message
    };
}

export function sendSocketMessage(message, ...args) {
    return (dispatch, getState) => {
        var state = getState();

        state.socket.socket.emit(message, ...args);

        return dispatch(socketMessageSent(message));
    };
}

export function sendGameMessage(message, ...args) {
    return (dispatch, getState) => {
        var state = getState();

        state.socket.gameSocket.emit('game', message, ...args);

        return dispatch(socketMessageSent(message));
    };
}

export function gameSocketConnected(socket) {
    return {
        type: 'GAME_SOCKET_CONNECTED',
        socket: socket
    };
}

export function gameSocketConnectError() {
    return {
        type: 'GAME_SOCKET_CONNECT_ERROR'
    };
}

export function gameSocketDisconnect() {
    return {
        type: 'GAME_SOCKET_DISCONNETED'
    };
}

export function gameSocketReconnecting() {
    return {
        type: 'GAME_SOCKET_RECONNECTED'
    };
}

export function gameSocketConnecting(host) {
    return {
        type: 'GAME_SOCKET_CONNECTING',
        host: host
    };
}

export function gameSocketConnectFailed() {
    return {
        type: 'GAME_SOCKET_CONNECT_FAILED'
    };
}

export function sendGameSocketConnectFailed() {
    return (dispatch, getState) => {
        var state = getState();

        if(state.socket.socket) {
            state.socket.socket.emit('connectfailed');
        }

        return dispatch(gameSocketConnectFailed());
    };
}

export function gameSocketClosed(message) {
    return {
        type: 'GAME_SOCKET_CLOSED',
        message: message
    };
}

export function gameSocketClose() {
    return (dispatch) => {
        return dispatch(gameSocketClosed());
    };
}
