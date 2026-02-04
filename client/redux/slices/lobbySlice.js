import _ from 'underscore';
import * as jsondiffpatch from 'jsondiffpatch';
import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
    games: [],
    users: [],
    messages: [],
    windowBlurred: false
};

const handleGameState = (state, game, username) => {
    state.currentGame = jsondiffpatch.clone(game);

    const currentState = state.currentGame;
    if (!currentState) {
        state.newGame = false;
        return;
    }

    if (
        currentState.spectators.some((spectator) => {
            return spectator.name === username;
        })
    ) {
        return;
    }

    if (currentState) {
        delete state.passwordGame;
        delete state.passwordJoinType;
        delete state.passwordError;
    }

    if (state.currentGame && !state.currentGame.started) {
        state.newGame = false;
    }
};

const handleMessage = (state, message, args) => {
    switch (message) {
        case 'games': {
            state.games = args[0];
            if (
                state.currentGame &&
                !args[0].some((game) => {
                    return game.id === state.currentGame.id;
                })
            ) {
                state.currentGame = undefined;
                state.newGame = false;
            }
            break;
        }
        case 'newgame':
            state.games = [...args[0], ...state.games];
            break;
        case 'removegame':
            state.games = state.games.filter((game) => !args[0].some((g) => g.id === game.id));
            break;
        case 'updategame': {
            const updatedGames = state.games.slice(0);
            for (const game of args[0]) {
                const index = _.findIndex(updatedGames, (g) => g.id === game.id);
                updatedGames[index] = game;
            }
            state.games = updatedGames;
            break;
        }
        case 'users':
            state.users = args[0];
            break;
        case 'newuser': {
            const users = state.users.slice(0);
            users.push(args[0]);
            state.users = users.sort((a, b) => a < b);
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
            const messageItem = state.messages.find(
                (messageItem) => messageItem.id === parseInt(args[0])
            );
            if (messageItem) {
                messageItem.deletedBy = args[1];
                messageItem.deleted = true;
                state.messages = [].concat(state.messages);
            }
            break;
        }
        case 'banner':
            state.bannerNotice = args[0];
            break;
        case 'motd':
            state.motd = args[0];
            break;
        case 'gamestate':
            handleGameState(state, args[0], args[1]);
            break;
        case 'cleargamestate':
            state.newGame = false;
            state.currentGame = undefined;
            break;
    }
};

const lobbySlice = createSlice({
    name: 'lobby',
    initialState: defaultState,
    reducers: {
        connecting: (state, action) => {
            state.connecting = true;
            state.connected = false;
            state.socket = action.payload.socket;
        },
        connected: (state) => {
            state.connecting = false;
            state.connected = true;
        },
        disconnected: (state) => {
            state.connecting = false;
            state.connected = false;
        },
        reconnecting: (state) => {
            state.connected = false;
            state.connecting = true;
        },
        messageReceived: (state, action) => {
            handleMessage(state, action.payload.message, action.payload.args);
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
        }
    }
});

export const lobbyActions = lobbySlice.actions;
export default lobbySlice.reducer;
