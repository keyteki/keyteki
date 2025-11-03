import io from 'socket.io-client';

import * as actions from '.';
import * as lobbyActions from '../slices/lobbySlice';
import * as gamesActions from '../slices/gamesSlice';

// Re-export slice actions
export {
    lobbyConnecting,
    lobbyConnected,
    lobbyDisconnected,
    lobbyReconnecting,
    lobbyMessageReceived,
    responseTimeReceived as lobbyResponseTimeReceived
} from '../slices/lobbySlice';

export { handoffReceived as handoff } from '../slices/gamesSlice';

export function socketMessageSent(message) {
    return {
        type: 'SOCKET_MESSAGE_SENT',
        message: message
    };
}

export function sendSocketMessage(message, ...args) {
    return (dispatch, getState) => {
        var state = getState();

        state.lobby.socket.emit(message, ...args);

        return dispatch(socketMessageSent(message));
    };
}

export function sendGameMessage(message, ...args) {
    return (dispatch, getState) => {
        var state = getState();

        if (state.games.socket) {
            state.games.socket.emit('game', message, ...args);
        }

        return dispatch(socketMessageSent(message));
    };
}

export function authenticateSocket() {
    return (dispatch, getState) => {
        let state = getState();

        if (state.lobby.socket && state.auth.token) {
            state.lobby.socket.emit('authenticate', state.auth.token);
        }
    };
}

export function handoffReceived(details) {
    return (dispatch, getState) => {
        let url =
            details.address && details.address !== 'undefined'
                ? '//' + details.address
                : '//' + window.location.hostname;
        let standardPorts = [80, 443];
        let state = getState();

        dispatch(gamesActions.handoffReceived({ gameId: details.gameId }));

        if (details.port && !standardPorts.some((p) => p === details.port)) {
            url += ':' + details.port;
        }

        dispatch(actions.setAuthTokens(details.authToken, state.auth.refreshToken, details.user));

        if (state.games.socket && state.games.gameId !== details.gameId) {
            dispatch(actions.closeGameSocket());
        }

        dispatch(actions.connectGameSocket(url, details.name));
    };
}

export function nodeStatusReceived(status) {
    return {
        type: 'NODE_STATUS_RECEIVED',
        status: status
    };
}

const messages = [
    'newgame',
    'removegame',
    'updategame',
    'games',
    'users',
    'newuser',
    'userleft',
    'lobbychat',
    'nochat',
    'passworderror',
    'lobbymessages',
    'banner',
    'motd',
    'cleargamestate',
    'gameerror'
];

export function connectLobby() {
    return (dispatch, getState) => {
        let state = getState();

        if (state.lobby.socket && state.lobby.socket.connected) {
            return;
        }

        let queryString = state.auth.token ? 'token=' + state.auth.token + '&' : '';
        queryString += 'version=' + process.env.VERSION || 'Local build';

        let socket = io.connect(window.location.origin, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
            query: queryString
        });

        dispatch(lobbyActions.lobbyConnecting(socket));

        socket.on('pong', (responseTime) => {
            dispatch(lobbyActions.responseTimeReceived(responseTime));
        });

        socket.on('connect', () => {
            dispatch(lobbyActions.lobbyConnected());
        });

        socket.on('disconnect', () => {
            dispatch(lobbyActions.lobbyDisconnected());
        });

        socket.on('reconnect', () => {
            dispatch(lobbyActions.lobbyReconnecting());
        });

        for (const message of messages) {
            socket.on(message, (arg) => {
                dispatch(lobbyActions.lobbyMessageReceived({ message, args: [arg] }));
            });
        }

        socket.on('gamestate', (game) => {
            state = getState();
            dispatch(
                lobbyActions.lobbyMessageReceived({
                    message: 'gamestate',
                    args: [game, state.account.user ? state.account.user.username : undefined]
                })
            );
        });

        socket.on('handoff', (handoff) => {
            dispatch(handoffReceived(handoff));
        });

        socket.on('authfailed', () => {
            dispatch(actions.authenticate());
        });

        socket.on('nodestatus', (status) => {
            dispatch(nodeStatusReceived(status));
        });

        socket.on('removemessage', (messageId, deletedBy) => {
            dispatch(
                lobbyActions.lobbyMessageReceived({
                    message: 'removemessage',
                    args: [messageId, deletedBy]
                })
            );
        });
    };
}
