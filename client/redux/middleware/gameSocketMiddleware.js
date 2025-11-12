/**
 * Game Socket middleware that handles game socket.io connection management and emissions.
 *
 * This keeps reducers pure while centralizing game socket management:
 * - Establishes socket.io connection to game server when connectGameSocket action is dispatched
 * - Sets up event listeners for incoming game socket messages
 * - Emits game messages when sendGameMessage action is dispatched
 * - Handles socket cleanup when closeGameSocket is dispatched
 */
import io from 'socket.io-client';
import * as jsondiffpatch from 'jsondiffpatch';
import {
    gameSocketConnecting,
    gameSocketConnected,
    gameSocketDisconnected,
    gameSocketReconnecting,
    gameSocketReconnected,
    gameSocketConnectFailed,
    gameSocketClosed,
    gameSocketResponseTimeReceived
} from '../slices/gamesSlice';
import { lobbyMessageReceived, setRootState, clearGameState } from '../slices/lobbySlice';

const patcher = jsondiffpatch.create({
    objectHash: (obj, index) => {
        return obj.uuid || obj.name || obj.id || obj._id || '$$index:' + index;
    }
});

/**
 * Sets up game socket event listeners
 */
function setupGameSocketListeners(gameSocket, store) {
    const { dispatch, getState } = store;

    gameSocket.on('pong', (responseTime) => {
        dispatch(gameSocketResponseTimeReceived(responseTime));
    });

    gameSocket.on('connect', () => {
        dispatch(gameSocketConnected(gameSocket));
    });

    gameSocket.on('connect_error', () => {
        const state = getState();
        if (state.lobby.socket) {
            state.lobby.socket.emit('connectfailed');
        }
        dispatch(gameSocketConnectFailed());
    });

    gameSocket.on('disconnect', () => {
        dispatch(gameSocketDisconnected());
    });

    gameSocket.on('reconnecting', () => {
        dispatch(gameSocketReconnecting());
    });

    gameSocket.on('reconnect', () => {
        dispatch(gameSocketReconnected());
    });

    gameSocket.on('reconnect_failed', () => {
        dispatch(gameSocketConnectFailed());
    });

    gameSocket.on('gamestate', (game) => {
        const state = getState();
        let gameState;

        if (state.lobby.rootState) {
            gameState = patcher.patch(state.lobby.currentGame, game);
        } else {
            gameState = game;
            dispatch(setRootState(game));
        }

        dispatch(
            lobbyMessageReceived({
                message: 'gamestate',
                args: [gameState, state.auth?.user?.username]
            })
        );
    });

    gameSocket.on('cleargamestate', () => {
        dispatch(clearGameState());
    });
}

const gameSocketMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    // Handle game socket connection
    if (action.type === 'games/connectGameSocket') {
        const { url, name } = action.payload;

        const gameSocket = io.connect(url, {
            path: '/' + name + '/socket.io',
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            query: state.auth?.token ? 'token=' + state.auth.token : undefined
        });

        store.dispatch(gameSocketConnecting(url + '/' + name));

        // Set up event listeners
        setupGameSocketListeners(gameSocket, store);

        return result;
    }

    // Handle closing game socket
    if (action.type === 'games/closeGameSocket') {
        if (state.games.socket) {
            state.games.socket.gameClosing = true;
            state.games.socket.close();
        }
        store.dispatch(gameSocketClosed());
        return result;
    }

    // Handle game message emission
    if (action.type === 'games/sendGameMessage') {
        const socket = state.games?.socket;
        if (socket) {
            const { message, args } = action.payload;
            socket.emit('game', message, ...args);
        }
        return result;
    }

    return result;
};

export default gameSocketMiddleware;
