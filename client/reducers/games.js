import _ from 'underscore';

function games(state = {
    games: []
}, action) {
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
            }

            return ret;
        case 'RECEIVE_NEWGAME':
            return Object.assign({}, state, {
                currentGame: action.game,
                newGame: false
            });
        case 'RECEIVE_JOINGAME':
            return Object.assign({}, state, {
                currentGame: action.game
            });
        case 'RECEIVE_GAMESTATE':
            var retState = Object.assign({}, state, {
                currentGame: action.currentGame
            });

            var currentState = retState.currentGame;
            if(!currentState) {
                return retState;
            }

            if(currentState && _.any(currentState.spectators, spectator => {
                return spectator.name === action.username;
            })) {
                return retState;
            }

            if(!currentState || !currentState.players[action.username] || currentState.players[action.username].left) {
                delete retState.currentGame;
            }
            
            return retState;
        case 'RECEIVE_USERS':
            return Object.assign({}, state, {
                users: action.users
            });
        default:
            return state;
    }
}

export default games;
