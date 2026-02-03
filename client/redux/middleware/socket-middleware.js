import io from 'socket.io-client';
import * as jsondiffpatch from 'jsondiffpatch';

import { gamesActions } from '../slices/gamesSlice';
import { lobbyActions } from '../slices/lobbySlice';
import {
    gameCloseRequested,
    gameConnectRequested,
    gameSendMessage,
    lobbyAuthenticateRequested,
    lobbyConnectRequested,
    lobbyDisconnectRequested,
    lobbyLeaveGameRequested,
    lobbySendMessage,
    lobbyStartGameRequested
} from '../socketActions';
import { setAuthTokens, authenticate } from '../actions/account';

let lobbySocket;
let gameSocket;
const patcher = jsondiffpatch.create({
    objectHash: (obj, index) => {
        return obj.uuid || obj.name || obj.id || obj._id || '$$index:' + index;
    }
});

const lobbyMessages = [
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

export const socketMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    if (lobbyConnectRequested.match(action)) {
        if (lobbySocket && lobbySocket.connected) {
            return result;
        }

        let queryString = state.auth.token ? `token=${state.auth.token}&` : '';
        queryString += `version=${import.meta.env.VERSION || 'Local build'}`;

        lobbySocket = io.connect(window.location.origin, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
            query: queryString
        });

        store.dispatch(lobbyActions.connecting({ socket: lobbySocket }));

        lobbySocket.on('pong', (responseTime) => {
            store.dispatch(lobbyActions.responseTimeReceived(responseTime));
        });

        lobbySocket.on('connect', () => {
            store.dispatch(lobbyActions.connected());
        });

        lobbySocket.on('disconnect', () => {
            store.dispatch(lobbyActions.disconnected());
        });

        lobbySocket.on('reconnect', () => {
            store.dispatch(lobbyActions.reconnecting());
        });

        for (const message of lobbyMessages) {
            lobbySocket.on(message, (arg) => {
                store.dispatch(lobbyActions.messageReceived({ message, args: [arg] }));
            });
        }

        lobbySocket.on('gamestate', (game) => {
            const currentState = store.getState();
            store.dispatch(
                lobbyActions.messageReceived({
                    message: 'gamestate',
                    args: [
                        game,
                        currentState.account.user ? currentState.account.user.username : undefined
                    ]
                })
            );
        });

        lobbySocket.on('handoff', (handoff) => {
            const standardPorts = [80, 443];
            let url =
                handoff.address && handoff.address !== 'undefined'
                    ? `//${handoff.address}`
                    : `//${window.location.hostname}`;

            store.dispatch(gamesActions.handoffReceived(handoff));

            if (handoff.port && !standardPorts.includes(handoff.port)) {
                url += `:${handoff.port}`;
            }

            store.dispatch(setAuthTokens(handoff.authToken, state.auth.refreshToken, handoff.user));

            if (gameSocket && state.games.gameId !== handoff.gameId) {
                store.dispatch(gameCloseRequested());
            }

            store.dispatch(gameConnectRequested(url, handoff.name));
        });

        lobbySocket.on('authfailed', () => {
            store.dispatch(authenticate());
        });

        lobbySocket.on('nodestatus', (status) => {
            store.dispatch({ type: 'NODE_STATUS_RECEIVED', status });
        });

        lobbySocket.on('removemessage', (messageId, deletedBy) => {
            store.dispatch(
                lobbyActions.messageReceived({
                    message: 'removemessage',
                    args: [messageId, deletedBy]
                })
            );
        });
    }

    if (lobbyDisconnectRequested.match(action)) {
        if (lobbySocket) {
            lobbySocket.closing = true;
            lobbySocket.disconnect();
        }
    }

    if (lobbyAuthenticateRequested.match(action)) {
        if (lobbySocket && state.auth.token) {
            lobbySocket.emit('authenticate', state.auth.token);
        }
    }

    if (lobbySendMessage.match(action)) {
        const { message, args } = action.payload;
        if (lobbySocket) {
            lobbySocket.emit(message, ...args);
        }
    }

    if (lobbyStartGameRequested.match(action)) {
        if (lobbySocket) {
            lobbySocket.emit('startgame', action.payload.gameId);
        }
        store.dispatch(lobbyActions.gameStarting());
    }

    if (lobbyLeaveGameRequested.match(action)) {
        if (lobbySocket) {
            lobbySocket.emit('leavegame', action.payload.gameId);
        }
        store.dispatch(lobbyActions.gameSocketClosed());
        store.dispatch(gamesActions.socketClosed());
    }

    if (gameConnectRequested.match(action)) {
        const { url, name } = action.payload;
        const currentState = store.getState();
        gameSocket = io.connect(url, {
            path: `/${name}/socket.io`,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            query: currentState.auth.token ? `token=${currentState.auth.token}` : undefined
        });

        store.dispatch(
            gamesActions.socketConnecting({
                host: `${url}/${name}`,
                socket: gameSocket
            })
        );

        gameSocket.on('pong', (responseTime) => {
            store.dispatch(gamesActions.responseTimeReceived(responseTime));
        });

        gameSocket.on('connect', () => {
            store.dispatch(gamesActions.socketConnected({ socket: gameSocket }));
        });

        gameSocket.on('connect_error', () => {
            if (lobbySocket) {
                lobbySocket.emit('connectfailed');
            }
            store.dispatch(gamesActions.socketConnectError());
        });

        gameSocket.on('disconnect', () => {
            store.dispatch(gamesActions.socketDisconnected());
            store.dispatch(lobbyActions.gameSocketDisconnected());
        });

        gameSocket.on('reconnecting', () => {
            store.dispatch(gamesActions.socketReconnecting());
        });

        gameSocket.on('reconnect', () => {
            store.dispatch(gamesActions.socketReconnected());
        });

        gameSocket.on('reconnect_failed', () => {
            store.dispatch(gamesActions.socketConnectFailed());
        });

        gameSocket.on('gamestate', (game) => {
            const latestState = store.getState();
            let gameState;

            if (latestState.lobby.rootState) {
                gameState = patcher.patch(latestState.lobby.currentGame, game);
            } else {
                gameState = game;
                store.dispatch(lobbyActions.setRootState(game));
            }

            store.dispatch(
                lobbyActions.messageReceived({
                    message: 'gamestate',
                    args: [
                        gameState,
                        latestState.auth.user ? latestState.auth.user.username : undefined
                    ]
                })
            );
        });

        gameSocket.on('cleargamestate', () => {
            store.dispatch(lobbyActions.clearGameState());
        });
    }

    if (gameCloseRequested.match(action)) {
        if (gameSocket) {
            gameSocket.gameClosing = true;
            gameSocket.close();
        }
        store.dispatch(gamesActions.socketClosed());
        store.dispatch(lobbyActions.gameSocketClosed());
    }

    if (gameSendMessage.match(action)) {
        const { message, args } = action.payload;
        if (gameSocket) {
            gameSocket.emit('game', message, ...args);
        }
    }

    return result;
};
