import io from 'socket.io-client';

export function receiveGames(games) {
    return {
        type: 'RECEIVE_GAMES',
        games: games
    };
}

export function loadUserGames() {
    return {
        types: ['REQUEST_USERGAMES', 'RECEIVE_USERGAMES'],
        shouldCallAPI: () => true,
        APIParams: { url: '/api/games', cache: false }
    };
}

export function startNewGame() {
    return {
        type: 'START_NEWGAME'
    };
}

export function cancelNewGame() {
    return {
        type: 'CANCEL_NEWGAME'
    };
}

export function clearGameState() {
    return {
        type: 'CLEAR_GAMESTATE'
    };
}

export function receiveGameState(game, username) {
    return (dispatch) => {
        dispatch({
            type: 'LOBBY_MESSAGE_RECEIVED',
            message: 'gamestate',
            args: [game, username]
        });
    };
}

export function joinPasswordGame(game, type) {
    return {
        type: 'JOIN_PASSWORD_GAME',
        game: game,
        joinType: type
    };
}

export function receivePasswordError(message) {
    return {
        type: 'RECEIVE_PASSWORD_ERROR',
        message: message
    };
}

export function cancelPasswordJoin() {
    return {
        type: 'CANCEL_PASSWORD_JOIN'
    };
}

export function gameSocketConnecting(host, socket) {
    return {
        type: 'GAME_SOCKET_CONNECTING',
        host: host,
        socket: socket
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

export function gameSocketDisconnected() {
    return {
        type: 'GAME_SOCKET_DISCONNECTED'
    };
}

export function gameSocketReconnecting() {
    return {
        type: 'GAME_SOCKET_RECONNECTING'
    };
}

export function gameSocketReconnected() {
    return {
        type: 'GAME_SOCKET_RECONNECTED'
    };
}

export function gameSocketConnectFailed() {
    return {
        type: 'GAME_SOCKET_CONNECT_FAILED'
    };
}

export function responseTimeReceived(responseTime) {
    return {
        type: 'GAME_SOCKET_RESPONSE_TIME_RECEIVED',
        responseTime: responseTime
    };
}

export function connectGameSocket(url, name) {
    return (dispatch, getState) => {
        let state = getState();

        let gameSocket = io.connect(url, {
            path: '/' + name + '/socket.io',
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            query: state.auth.token ? 'token=' + state.auth.token : undefined
        });

        gameSocket.on('pong', (responseTime) => {
            dispatch(responseTimeReceived(responseTime));
        });

        dispatch(gameSocketConnecting(url + '/' + name, gameSocket));

        gameSocket.on('connect', () => {
            dispatch(gameSocketConnected(gameSocket));
        });

        gameSocket.on('connect_error', (err) => {
            if (state.lobby.socket) {
                state.lobby.socket.emit('connectfailed');
            }

            dispatch(gameSocketConnectError(err));
        });

        gameSocket.on('disconnect', () => {
            dispatch(gameSocketDisconnected(gameSocket.gameClosing));
        });

        gameSocket.on('reconnecting', (attemptNumber) => {
            dispatch(gameSocketReconnecting(attemptNumber));
        });

        gameSocket.on('reconnect', () => {
            dispatch(gameSocketReconnected());
        });

        gameSocket.on('reconnect_failed', () => {
            dispatch(gameSocketConnectFailed());
        });

        gameSocket.on('gamestate', (game) => {
            state = getState();

            dispatch(
                receiveGameState(game, state.auth.user ? state.auth.user.username : undefined)
            );
        });

        gameSocket.on('cleargamestate', () => {
            dispatch(clearGameState());
        });
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

export function closeGameSocket() {
    return (dispatch, getState) => {
        let state = getState();

        if (state.games.socket) {
            state.games.socket.gameClosing = true;
            state.games.socket.close();
        }

        return dispatch(gameSocketClosed());
    };
}

export function gameStarting() {
    return {
        type: 'GAME_STARTING'
    };
}

export function startGame(id) {
    return (dispatch, getState) => {
        let state = getState();

        if (state.lobby.socket) {
            state.lobby.socket.emit('startgame', id);
        }

        return dispatch(gameStarting());
    };
}

export function leaveGame(id) {
    return (dispatch, getState) => {
        let state = getState();

        if (state.lobby.socket) {
            state.lobby.socket.emit('leavegame', id);
        }

        return dispatch(gameSocketClose());
    };
}
