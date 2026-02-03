import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        socketConnecting: (state, action) => {
            state.connecting = true;
            state.connected = false;
            state.gameHost = action.payload.host;
            state.socket = action.payload.socket;
        },
        socketConnected: (state, action) => {
            state.socket = action.payload.socket;
            state.connecting = false;
            state.connected = true;
        },
        socketConnectError: (state) => {
            state.connecting = false;
            state.connected = false;
        },
        socketDisconnected: (state) => {
            state.connecting = false;
            state.connected = false;
        },
        socketReconnecting: (state) => {
            state.connecting = true;
            state.connected = false;
        },
        socketReconnected: (state) => {
            state.connecting = false;
            state.connected = true;
        },
        socketConnectFailed: (state) => {
            state.connecting = false;
            state.connected = false;
            state.gameHost = undefined;
        },
        socketClosed: (state) => {
            state.connected = false;
            state.connecting = false;
            state.gameHost = undefined;
            state.socket = undefined;
        },
        handoffReceived: (state, action) => {
            state.gameId = action.payload.gameId;
        },
        responseTimeReceived: (state, action) => {
            state.responseTime = action.payload;
        },
        userGamesReceived: (state, action) => {
            state.games = action.payload.games;
        }
    }
});

export const gamesActions = gamesSlice.actions;
export default gamesSlice.reducer;
