// @ts-nocheck
import io from 'socket.io-client';
import * as jsondiffpatch from 'jsondiffpatch';
import * as gamesActions from '../slices/gamesSlice';
import * as lobbyActions from '../slices/lobbySlice';
import { api } from '../slices/apiSlice';

// Re-export RTK Query hooks
export const { useLoadUserGamesQuery } = api;

// Re-export slice actions
export {
    gameSocketConnected,
    gameSocketConnecting,
    gameSocketConnectFailed,
    gameSocketDisconnected,
    gameSocketReconnecting,
    gameSocketReconnected,
    gameSocketClosed,
    receiveUserGames,
    gameSocketResponseTimeReceived
} from '../slices/gamesSlice';

export {
    startNewGame,
    cancelNewGame,
    clearGameState,
    joinPasswordGame,
    cancelPasswordJoin,
    gameStarting,
    setRootState
} from '../slices/lobbySlice';

const patcher = jsondiffpatch.create({
    objectHash: (obj, index) => {
        return obj.uuid || obj.name || obj.id || obj._id || '$$index:' + index;
    }
});

export function receiveGames(games) {
    return {
        type: 'RECEIVE_GAMES',
        games: games
    };
}

export function loadUserGames() {
    return (dispatch) => {
        return dispatch(api.endpoints.loadUserGames.initiate());
    };
}

export function receiveGameState(game, username) {
    return (dispatch) => {
        dispatch(
            lobbyActions.lobbyMessageReceived({
                message: 'gamestate',
                args: [game, username]
            })
        );
    };
}

export function receivePasswordError(message) {
    return {
        type: 'RECEIVE_PASSWORD_ERROR',
        message: message
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
            dispatch(gamesActions.gameSocketResponseTimeReceived(responseTime));
        });

        dispatch(gamesActions.gameSocketConnecting(url + '/' + name));

        gameSocket.on('connect', () => {
            dispatch(gamesActions.gameSocketConnected(gameSocket));
        });

        gameSocket.on('connect_error', (err) => {
            if (state.lobby.socket) {
                state.lobby.socket.emit('connectfailed');
            }

            dispatch(gameSocketConnectError(err));
        });

        gameSocket.on('disconnect', () => {
            dispatch(gamesActions.gameSocketDisconnected());
        });

        gameSocket.on('reconnecting', () => {
            dispatch(gamesActions.gameSocketReconnecting());
        });

        gameSocket.on('reconnect', () => {
            dispatch(gamesActions.gameSocketReconnected());
        });

        gameSocket.on('reconnect_failed', () => {
            dispatch(gamesActions.gameSocketConnectFailed());
        });

        gameSocket.on('gamestate', (game) => {
            state = getState();

            let gameState;

            if (state.lobby.rootState) {
                gameState = patcher.patch(state.lobby.currentGame, game);
            } else {
                gameState = game;
                dispatch(lobbyActions.setRootState(game));
            }

            dispatch(
                receiveGameState(gameState, state.auth.user ? state.auth.user.username : undefined)
            );
        });

        gameSocket.on('cleargamestate', () => {
            dispatch(lobbyActions.clearGameState());
        });
    };
}

export function gameSocketConnectError(err) {
    return {
        type: 'GAME_SOCKET_CONNECT_ERROR',
        error: err
    };
}

export function gameSocketClose() {
    return (dispatch) => {
        return dispatch(gamesActions.gameSocketClosed());
    };
}

export function closeGameSocket() {
    return (dispatch, getState) => {
        let state = getState();

        if (state.games.socket) {
            state.games.socket.gameClosing = true;
            state.games.socket.close();
        }

        return dispatch(gamesActions.gameSocketClosed());
    };
}

export function startGame(id) {
    return (dispatch, getState) => {
        let state = getState();

        if (state.lobby.socket) {
            state.lobby.socket.emit('startgame', id);
        }

        return dispatch(lobbyActions.gameStarting());
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
