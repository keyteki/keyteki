export function receiveGames(games) {
    return {
        type: 'RECEIVE_GAMES',
        games: games
    };
}

export function startNewGame() {
    return {
        type: 'START_NEWGAME'
    };
}

export function cancelNewGame() {
    return {
        type: 'CANCEL_NEWGAME'
    };
}

export function receiveGameState(game, username) {
    return {
        type: 'RECEIVE_GAMESTATE',
        currentGame: game,
        username: username
    };
}

export function clearGameState() {
    return {
        type: 'CLEAR_GAMESTATE'
    };
}

export function joinPasswordGame(game, type) {
    return {
        type: 'JOIN_PASSWORD_GAME',
        game: game,
        joinType: type
    };
}

export function receivePasswordError(message) {
    return {
        type: 'RECEIVE_PASSWORD_ERROR',
        message: message
    };
}

export function cancelPasswordJoin() {
    return {
        type: 'CANCEL_PASSWORD_JOIN'
    };
}
