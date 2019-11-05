import io from 'socket.io-client';

import version from '../../version';
import * as actions from '../actions';

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

        if(state.games.socket) {
            state.games.socket.emit('game', message, ...args);
        }

        return dispatch(socketMessageSent(message));
    };
}

export function lobbyConnecting(socket) {
    return {
        type: 'LOBBY_CONNECTING',
        socket: socket
    };
}

export function lobbyConnected(socket) {
    return {
        type: 'LOBBY_CONNECTED',
        socket: socket
    };
}

export function lobbyDisconnected() {
    return {
        type: 'LOBBY_DISCONNECTED'
    };
}

export function lobbyReconnecting() {
    return {
        type: 'LOBBY_RECONNECTING'
    };
}

export function lobbyMessageReceived(message, ...args) {
    return {
        type: 'LOBBY_MESSAGE_RECEIVED',
        message: message,
        args
    };
}

export function authenticateSocket() {
    return (dispatch, getState) => {
        let state = getState();

        if(state.lobby.socket && state.auth.token) {
            state.lobby.socket.emit('authenticate', state.auth.token);
        }
    };
}

export function handoff(details) {
    return {
        type: 'HANDOFF_RECEIVED',
        details: details
    };
}

export function handoffReceived(details) {
    return (dispatch, getState) => {
        let url = '//' + details.address;
        let standardPorts = [80, 443];
        let state = getState();

        dispatch(handoff(details));

        if(details.port && !standardPorts.some(p => p === details.port)) {
            url += ':' + details.port;
        }

        dispatch(actions.setAuthTokens(details.authToken, state.auth.refreshToken));

        if(state.games.socket && state.games.gameId !== details.gameId) {
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

export function connectLobby() {
    return (dispatch, getState) => {
        let state = getState();
        let queryString = state.auth.token ? 'token=' + state.auth.token + '&' : '';
        queryString += 'version=' + version.releaseDate;

        let socket = io.connect(window.location.origin, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
            query: queryString
        });

        dispatch(lobbyConnecting(socket));

        socket.on('connect', () => {
            dispatch(lobbyConnected());
        });

        socket.on('disconnect', () => {
            dispatch(lobbyDisconnected());
        });

        socket.on('reconnect', () => {
            dispatch(lobbyReconnecting());
        });

        socket.on('newgame', games => {
            dispatch(lobbyMessageReceived('newgame', games));
        });

        socket.on('removegame', games => {
            dispatch(lobbyMessageReceived('removegame', games));
        });

        socket.on('updategame', games => {
            dispatch(lobbyMessageReceived('updategame', games));
        });

        socket.on('games', games => {
            dispatch(lobbyMessageReceived('games', games));
        });

        socket.on('users', users => {
            dispatch(lobbyMessageReceived('users', users));
        });

        socket.on('newuser', user => {
            dispatch(lobbyMessageReceived('newuser', user));
        });

        socket.on('userleft', user => {
            dispatch(lobbyMessageReceived('userleft', user));
        });

        socket.on('passworderror', message => {
            dispatch(lobbyMessageReceived('passworderror', message));
        });

        socket.on('lobbychat', message => {
            dispatch(lobbyMessageReceived('lobbychat', message));
        });

        socket.on('nochat', messages => {
            dispatch(lobbyMessageReceived('nochat', messages));
        });

        socket.on('lobbymessages', messages => {
            dispatch(lobbyMessageReceived('lobbymessages', messages));
        });

        socket.on('banner', notice => {
            dispatch(lobbyMessageReceived('banner', notice));
        });

        socket.on('gamestate', game => {
            state = getState();
            dispatch(lobbyMessageReceived('gamestate', game, state.account.user ? state.account.user.username : undefined));
        });

        socket.on('motd', motd => {
            dispatch(lobbyMessageReceived('motd', motd));
        });

        socket.on('cleargamestate', () => {
            dispatch(lobbyMessageReceived('cleargamestate'));
        });

        socket.on('handoff', handoff => {
            dispatch(handoffReceived(handoff));
        });

        socket.on('authfailed', () => {
            dispatch(actions.authenticate());
        });

        socket.on('nodestatus', status => {
            dispatch(nodeStatusReceived(status));
        });

        socket.on('removemessage', messageId => {
            dispatch(lobbyMessageReceived('removemessage', messageId));
        });
    };
}
