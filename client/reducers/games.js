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
            return Object.assign({}, state, {
                games: action.games
            });
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
            }

            return retState;
        case 'RECEIVE_GAMESTATE':
            return Object.assign({}, state, {
                state: action.state
            });
        default:
            return state;
    }
}

export default games;
