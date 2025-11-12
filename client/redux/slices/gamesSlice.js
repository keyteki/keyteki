import { createSlice } from '@reduxjs/toolkit';

const gamesSlice = createSlice({
    name: 'games',
    initialState: {},
    reducers: {
        gameSocketConnected: (state, action) => {
            state.socket = action.payload;
            state.connecting = false;
            state.connected = true;
        },
        gameSocketConnecting: (state, action) => {
            state.connecting = true;
            state.connected = false;
            state.gameHost = action.payload;
        },
        gameSocketConnectFailed: (state) => {
            state.connecting = false;
            state.connected = false;
            state.gameHost = undefined;
        },
        gameSocketDisconnected: (state) => {
            state.connecting = false;
            state.connected = false;
        },
        gameSocketReconnecting: (state) => {
            state.connecting = true;
            state.connected = false;
        },
        gameSocketReconnected: (state) => {
            state.connecting = false;
            state.connected = true;
        },
        gameSocketClosed: (state) => {
            state.connected = false;
            state.connecting = false;
            state.gameHost = undefined;
            state.socket = undefined;
        },
        handoffReceived: (state, action) => {
            state.gameId = action.payload.gameId;
        },
        receiveUserGames: (state, action) => {
            state.games = action.payload;
        },
        gameSocketResponseTimeReceived: (state, action) => {
            state.responseTime = action.payload;
        },
        // Action to initiate game socket connection - actual connection handled by middleware
        connectGameSocket: () => {
            // Connection establishment handled by gameSocketMiddleware
        },
        // Action to close game socket - actual closing handled by middleware
        closeGameSocket: () => {
            // Socket closing handled by gameSocketMiddleware
        }
    }
});

export const {
    gameSocketConnected,
    gameSocketConnecting,
    gameSocketConnectFailed,
    gameSocketDisconnected,
    gameSocketReconnecting,
    gameSocketReconnected,
    gameSocketClosed,
    handoffReceived,
    receiveUserGames,
    gameSocketResponseTimeReceived,
    connectGameSocket,
    closeGameSocket
} = gamesSlice.actions;

// Custom action creator for sendGameMessage that matches the old signature
// Usage: dispatch(sendGameMessage('concede')) or dispatch(sendGameMessage('drop', uuid, source, target))
export const sendGameMessage = (message, ...args) => ({
    type: 'games/sendGameMessage',
    payload: { message, args }
});

export default gamesSlice.reducer;
