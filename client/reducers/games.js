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
        case 'RECEIVE_UPDATEGAME':
            return Object.assign({}, state, {
                currentGame: action.game
            });
        case 'RECEIVE_LEAVEGAME':
            var retState = Object.assign({}, state, {
                currentGame: action.game
            });

            if(action.isMe) {
                delete retState.currentGame;
                delete retState.state;
            }

            return retState;
        case 'RECEIVE_GAMESTATE':
            retState = Object.assign({}, state, {
                state: action.state
            });

            var currentState = state.state;

            if(currentState && currentState.players[action.username] && currentState.players[action.username].left) {
                delete retState.state;
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
