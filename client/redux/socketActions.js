import { createAction } from '@reduxjs/toolkit';

export const lobbyConnectRequested = createAction('lobby/connectRequested');
export const lobbyDisconnectRequested = createAction('lobby/disconnectRequested');
export const lobbyAuthenticateRequested = createAction('lobby/authenticateRequested');
export const lobbySendMessage = createAction('lobby/sendMessage', (message, ...args) => ({
    payload: { message, args }
}));
export const lobbyStartGameRequested = createAction('lobby/startGameRequested', (gameId) => ({
    payload: { gameId }
}));
export const lobbyLeaveGameRequested = createAction('lobby/leaveGameRequested', (gameId) => ({
    payload: { gameId }
}));

export const gameConnectRequested = createAction('game/connectRequested', (url, name) => ({
    payload: { url, name }
}));
export const gameCloseRequested = createAction('game/closeRequested');
export const gameSendMessage = createAction('game/sendMessage', (message, ...args) => ({
    payload: { message, args }
}));
