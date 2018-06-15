import _ from 'underscore';

function games(state = {
    games: []
}, action) {
    let retState = {};
    switch(action.type) {
        case 'START_NEWGAME':
            return Object.assign({}, state, {
                newGame: true
            });
        case 'CANCEL_NEWGAME':
            return Object.assign({}, state, {
                newGame: false
            });
        case 'RECEIVE_GAMES':
            var ret = Object.assign({}, state, {
                games: action.games
            });

            if(state.currentGame && !_.find(action.games, game => {
                return game.id === state.currentGame.id;
            })) {
                ret.currentGame = undefined;
                ret.newGame = false;
            }

            return ret;
        case 'RECEIVE_NEWGAME':
            return Object.assign({}, state, {
                currentGame: action.game,
                newGame: false
            });
        case 'RECEIVE_GAMESTATE':
            retState = Object.assign({}, state, {
                currentGame: action.currentGame
            });

            var currentState = retState.currentGame;
            if(!currentState) {
                retState.newGame = false;
                return retState;
            }

            if(currentState && _.any(currentState.spectators, spectator => {
                return spectator.name === action.username;
            })) {
                return retState;
            }

            if(!currentState || !currentState.players[action.username] || currentState.players[action.username].left) {
                delete retState.currentGame;
                retState.newGame = false;
            }

            if(currentState) {
                delete retState.passwordGame;
                delete retState.passwordJoinType;
                delete retState.passwordError;
            }

            return retState;
        case 'GAME_SOCKET_CLOSED':
            return Object.assign({}, state, {
                currentGame: undefined
            });
        case 'RECEIVE_USERS':
            return Object.assign({}, state, {
                users: action.users
            });
        case 'JOIN_PASSWORD_GAME':
            return Object.assign({}, state, {
                passwordGame: action.game,
                passwordJoinType: action.joinType
            });
        case 'RECEIVE_PASSWORD_ERROR':
            return Object.assign({}, state, {
                passwordError: action.message
            });
        case 'CANCEL_PASSWORD_JOIN':
            return Object.assign({}, state, {
                passwordGame: undefined,
                passwordError: undefined,
                passwordJoinType: undefined
            });
        case 'CLEAR_GAMESTATE':
            retState = _.omit(state, 'currentGame');
            retState.newGame = false;
            return retState;
        default:
            return state;
    }
}

export default games;
