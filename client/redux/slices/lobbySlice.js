import { createSlice } from '@reduxjs/toolkit';
import * as jsondiffpatch from 'jsondiffpatch';

const defaultState = {
    games: [],
    users: [],
    messages: [],
    windowBlurred: false,
    nodeStatus: null
};

const lobbySlice = createSlice({
    name: 'lobby',
    initialState: defaultState,
    reducers: {
        lobbyConnecting: (state, action) => {
            state.connecting = true;
            state.connected = false;
            state.socket = action.payload;
        },
        lobbyConnected: (state) => {
            state.connecting = false;
            state.connected = true;
        },
        lobbyDisconnected: (state) => {
            state.connecting = false;
            state.connected = false;
        },
        lobbyReconnecting: (state) => {
            state.connected = false;
            state.connecting = true;
        },
        nodeStatusReceived: (state, action) => {
            state.nodeStatus = action.payload;
        },
        connectLobby: () => {},
        lobbyMessageReceived: (state, action) => {
            const { message, args } = action.payload;
            handleMessage(state, message, args);
        },
        lobbyMessageDeleted: (state, action) => {
            const { message, args } = action.payload;
            handleMessage(state, message, args);
        },
        joinPasswordGame: (state, action) => {
            state.passwordGame = action.payload.game;
            state.passwordJoinType = action.payload.joinType;
        },
        cancelPasswordJoin: (state) => {
            state.passwordJoinType = undefined;
            state.passwordGame = undefined;
            state.passwordError = undefined;
        },
        gameSocketClosed: (state) => {
            state.currentGame = undefined;
            state.newGame = false;
            state.rootState = undefined;
        },
        gameSocketDisconnected: (state) => {
            state.rootState = undefined;
        },
        profileSavedLobby: () => {},
        gameStarting: (state) => {
            state.gameError = undefined;
        },
        startNewGame: (state) => {
            state.newGame = true;
        },
        cancelNewGame: (state) => {
            state.newGame = false;
        },
        clearChatStatus: (state) => {
            state.lobbyError = false;
        },
        clearGameState: (state) => {
            state.newGame = false;
            state.currentGame = undefined;
        },
        windowBlur: (state) => {
            state.windowBlurred = true;
        },
        windowFocus: (state) => {
            state.windowBlurred = false;
        },
        responseTimeReceived: (state, action) => {
            state.responseTime = action.payload;
        },
        setRootState: (state, action) => {
            state.rootState = action.payload;
        },
        sendLobbyChat: () => {},
        sendAuthenticate: () => {},
        sendGetNodeStatus: () => {},
        sendToggleNode: () => {},
        sendRestartNode: () => {},
        sendSetMotd: () => {},
        sendJoinGame: () => {},
        sendWatchGame: () => {},
        sendLeaveGame: () => {},
        sendStartGame: (state) => {
            state.gameError = undefined;
        },
        sendSelectDeck: () => {},
        sendNewGame: () => {},
        sendChatReadAcknowledge: () => {},
        sendRemoveGame: () => {},
        sendPasswordJoinGame: () => {},
        sendChat: () => {},
        sendGetSealedDeck: () => {},
        sendClearUserSessions: () => {}
    }
});

function handleMessage(state, message, args) {
    switch (message) {
        case 'games':
            state.games = args[0];

            // If the current game is no longer in the game list, it must have been closed
            if (state.currentGame && !args[0].some((game) => game.id === state.currentGame.id)) {
                state.currentGame = undefined;
                state.newGame = false;
            }
            break;

        case 'newgame':
            state.games = [...args[0], ...state.games];
            break;

        case 'removegame':
            state.games = state.games.filter((game) => !args[0].some((g) => g.id === game.id));
            break;

        case 'updategame': {
            const updatedGames = state.games.slice(0);
            for (let game of args[0]) {
                const index = updatedGames.findIndex((g) => g.id === game.id);
                if (index !== -1) {
                    updatedGames[index] = game;
                }
            }
            state.games = updatedGames;
            break;
        }

        case 'users':
            state.users = args[0];
            break;

        case 'newuser': {
            const users = [...state.users, args[0]].sort((a, b) => (a < b ? -1 : 1));
            state.users = users;
            break;
        }

        case 'userleft':
            state.users = state.users.filter((u) => u.username !== args[0].username);
            break;

        case 'passworderror':
            state.passwordError = args[0];
            break;

        case 'gameerror':
            state.gameError = args[0];
            break;

        case 'lobbychat':
            state.messages = [...state.messages, args[0]];
            break;

        case 'nochat':
            state.lobbyError = true;
            break;

        case 'lobbymessages':
            state.messages = args[0];
            break;

        case 'removemessage': {
            const message = state.messages.find((msg) => msg.id === parseInt(args[0]));
            if (message) {
                message.deletedBy = args[1];
                message.deleted = true;
                state.messages = [].concat(state.messages);
            }
            break;
        }

        case 'banner':
            state.notice = args[0];
            break;

        case 'motd':
            state.motd = args[0];
            break;

        case 'gamestate': {
            const currentGame = jsondiffpatch.clone(args[0]);
            const username = args[1];

            if (!currentGame) {
                state.newGame = false;
                delete state.currentGame;
                return;
            }

            state.currentGame = currentGame;

            if (currentGame.spectators.some((spectator) => spectator.name === username)) {
                return;
            }

            delete state.passwordGame;
            delete state.passwordJoinType;
            delete state.passwordError;

            if (state.currentGame && !state.currentGame.started) {
                state.newGame = false;
            }
            break;
        }

        case 'cleargamestate':
            state.newGame = false;
            state.currentGame = undefined;
            break;
    }
}

export const {
    lobbyConnecting,
    lobbyConnected,
    lobbyDisconnected,
    lobbyReconnecting,
    nodeStatusReceived,
    connectLobby,
    lobbyMessageReceived,
    lobbyMessageDeleted,
    joinPasswordGame,
    cancelPasswordJoin,
    gameSocketClosed,
    gameSocketDisconnected,
    profileSavedLobby,
    gameStarting,
    startNewGame,
    cancelNewGame,
    clearChatStatus,
    clearGameState,
    windowBlur,
    windowFocus,
    responseTimeReceived,
    setRootState,
    // Socket message senders
    sendLobbyChat,
    sendAuthenticate,
    sendGetNodeStatus,
    sendToggleNode,
    sendRestartNode,
    sendSetMotd,
    sendJoinGame,
    sendWatchGame,
    sendLeaveGame,
    sendStartGame,
    sendSelectDeck,
    sendNewGame,
    sendChatReadAcknowledge,
    sendRemoveGame,
    sendPasswordJoinGame,
    sendChat,
    sendGetSealedDeck,
    sendClearUserSessions
} = lobbySlice.actions;

export default lobbySlice.reducer;
