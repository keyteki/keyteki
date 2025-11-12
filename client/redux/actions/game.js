// @ts-nocheck
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
    gameSocketResponseTimeReceived,
    connectGameSocket,
    closeGameSocket,
    sendGameMessage
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

// Legacy thunk functions for startGame and leaveGame
// These use lobby socket to send messages, not game socket
export function startGame(id) {
    return (dispatch, getState) => {
        let state = getState();

        if (state.lobby.socket) {
            state.lobby.socket.emit('startgame', id);
        }

        return dispatch({ type: 'lobby/gameStarting' });
    };
}

export function leaveGame(id) {
    return (dispatch, getState) => {
        let state = getState();

        if (state.lobby.socket) {
            state.lobby.socket.emit('leavegame', id);
        }

        return dispatch({ type: 'games/gameSocketClosed' });
    };
}
