import io from 'socket.io-client';
import * as jsondiffpatch from 'jsondiffpatch';
import { uniqueId } from 'underscore';

const patcher = jsondiffpatch.create({
    objectHash: (obj, index) => {
        return obj.uuid || obj.name || obj.id || obj._id || '$$index:' + index;
    }
});

export function receiveGames(games) {
    return {
        type: 'RECEIVE_GAMES',
        games: games
    };
}

export function loadUserGames() {
    return {
        types: ['REQUEST_USERGAMES', 'RECEIVE_USERGAMES'],
        shouldCallAPI: () => true,
        APIParams: { url: '/api/games', cache: false }
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

export function clearGameState() {
    return {
        type: 'CLEAR_GAMESTATE'
    };
}

export function receiveGameState(game, username) {
    return (dispatch) => {
        dispatch({
            type: 'LOBBY_MESSAGE_RECEIVED',
            message: 'gamestate',
            args: [game, username]
        });
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

export function gameSocketConnecting(host, socket) {
    return {
        type: 'GAME_SOCKET_CONNECTING',
        host: host,
        socket: socket
    };
}

export function gameSocketConnected(socket) {
    return {
        type: 'GAME_SOCKET_CONNECTED',
        socket: socket
    };
}

export function gameSocketConnectError() {
    return {
        type: 'GAME_SOCKET_CONNECT_ERROR'
    };
}

export function gameSocketDisconnected() {
    return {
        type: 'GAME_SOCKET_DISCONNECTED'
    };
}

export function gameSocketReconnecting() {
    return {
        type: 'GAME_SOCKET_RECONNECTING'
    };
}

export function gameSocketReconnected() {
    return {
        type: 'GAME_SOCKET_RECONNECTED'
    };
}

export function gameSocketConnectFailed() {
    return {
        type: 'GAME_SOCKET_CONNECT_FAILED'
    };
}

export function responseTimeReceived(responseTime) {
    return {
        type: 'GAME_SOCKET_RESPONSE_TIME_RECEIVED',
        responseTime: responseTime
    };
}

export function connectGameSocket(url, name) {
    return (dispatch, getState) => {
        let state = getState();

        let gameSocket = io.connect(url, {
            path: '/' + name + '/socket.io',
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            query: state.auth.token ? 'token=' + state.auth.token : undefined
        });

        gameSocket.on('pong', (responseTime) => {
            dispatch(responseTimeReceived(responseTime));
        });

        dispatch(gameSocketConnecting(url + '/' + name, gameSocket));

        gameSocket.on('connect', () => {
            dispatch(gameSocketConnected(gameSocket));
        });

        gameSocket.on('connect_error', (err) => {
            if (state.lobby.socket) {
                state.lobby.socket.emit('connectfailed');
            }

            dispatch(gameSocketConnectError(err));
        });

        gameSocket.on('disconnect', () => {
            dispatch(gameSocketDisconnected(gameSocket.gameClosing));
        });

        gameSocket.on('reconnecting', (attemptNumber) => {
            dispatch(gameSocketReconnecting(attemptNumber));
        });

        gameSocket.on('reconnect', () => {
            dispatch(gameSocketReconnected());
        });

        gameSocket.on('reconnect_failed', () => {
            dispatch(gameSocketConnectFailed());
        });

        gameSocket.on('gamestate', (game) => {
            state = getState();

            let gameState;

            if (state.lobby.rootState) {
                createAnimationsAndAddToGame(state.lobby.currentGame, game, state.auth);
                gameState = patcher.patch(state.lobby.currentGame, game);
            } else {
                gameState = game;
                dispatch(setRootState(game));
            }

            dispatch(
                receiveGameState(gameState, state.auth.user ? state.auth.user.username : undefined)
            );
        });

        gameSocket.on('cleargamestate', () => {
            dispatch(clearGameState());
        });
    };
}

function createAnimationsAndAddToGame(currentGameState, newGameState, authState) {
    let diff = patcher.diff(currentGameState, newGameState);
    if (
        currentGameState &&
        Object.keys(currentGameState.players).length == 2 &&
        Object.values(diff.players).every((playerDiff) => !playerDiff.length) // duck-typing for arrays, which signify the players themselves are being added/removed
    ) {
        let thisPlayerUsername;
        let thisPlayer;
        if (
            authState.user &&
            authState.user.username &&
            currentGameState.players[authState.user.username]
        ) {
            // get the player that belongs to the client's perspective
            thisPlayerUsername = authState.user.username;
            thisPlayer = currentGameState.players[thisPlayerUsername];
        } else {
            // default value in case we're a spectator
            thisPlayer = Object.values(currentGameState.players)[0];
            thisPlayerUsername = thisPlayer.user.username;
        }

        let opponent = Object.values(currentGameState.players).find((player) => {
            return player.user.username !== thisPlayerUsername;
        });
        let opponentUsername = opponent && opponent.user.username;

        let amber = {
            player: getPlayerAmberDiff(diff.players[thisPlayerUsername]),
            opponent: getPlayerAmberDiff(diff.players[opponentUsername]),
            center:
                getPlayerCardsInPlayAmberTokenDiff(diff.players[thisPlayerUsername]) +
                getPlayerCardsInPlayAmberTokenDiff(diff.players[opponentUsername])
        };
        let resolvedAmberBonusCount = searchMessageDiffForString(diff, ' gains an amber due to ');
        let reapCount = searchMessageDiffForString(diff, 'reap with ');

        let closedAnimations = {};
        for (let i = 0; i < resolvedAmberBonusCount; i++) {
            count(
                closedAnimations,
                'supply-to-' + (thisPlayer.activePlayer ? 'player' : 'opponent')
            );
            if (thisPlayer.activePlayer) amber.player--;
            else amber.opponent--;
        }

        for (let i = 0; i < reapCount; i++) {
            count(
                closedAnimations,
                'supply-to-' + (thisPlayer.activePlayer ? 'player' : 'opponent') + '-bounce'
            );
            if (thisPlayer.activePlayer) amber.player--;
            else amber.opponent--;
        }

        let openAnimations = [];
        Object.entries(amber).forEach((e) => {
            for (let i = 0; i > e[1]; i--) {
                openAnimations.push(e[0] + '-to-');
            }
        });
        Object.entries(amber).forEach((e) => {
            for (let i = 0; i < e[1]; i++) {
                let a = openAnimations.pop();
                if (a) count(closedAnimations, a + e[0]);
                else count(closedAnimations, 'supply-to-' + e[0]);
            }
        });
        openAnimations.forEach((a) => count(closedAnimations, a + 'supply'));

        let newAnimations = [];
        Object.entries(closedAnimations).forEach((closedAnimation) => {
            for (let i = 0; i < closedAnimation[1]; i++) {
                newAnimations.push({
                    id: uniqueId(),
                    name: closedAnimation[0],
                    delay: i,
                    activePlayer: thisPlayer.activePlayer ? thisPlayerUsername : opponentUsername
                });
            }
        });

        // change the animations value in the game directly instead of patching (because the game does not have an 'animations' key?)
        if (Array.isArray(currentGameState.animations)) {
            let oldAnimations = currentGameState.animations;
            // if the player is changing the diff looks like [true, [true, false]], otherwise like [true, 0, 0]
            let isActivePlayerChanging =
                !!diff.players[thisPlayerUsername].activePlayer &&
                Array.isArray(diff.players[thisPlayerUsername].activePlayer[1]);
            if (isActivePlayerChanging) {
                // Delete a player's animations only when the turn is passed back to them.
                // Otherwise, a player that ends the turn quickly may stop animations before they finish.
                oldAnimations = oldAnimations.filter((a) =>
                    thisPlayer.activePlayer
                        ? a.activePlayer == thisPlayerUsername
                        : a.activePlayer == opponentUsername
                );
            }
            currentGameState.animations = oldAnimations.concat(newAnimations);
        } else {
            currentGameState.animations = newAnimations;
        }
    }
}

function count(obj, thing) {
    if (obj[thing]) obj[thing] = obj[thing] + 1;
    else obj[thing] = 1;
}

function searchMessageDiffForString(diff, string) {
    let messageDiff = diff.messages;
    let messageCount = 0;
    if (
        Array.isArray(messageDiff) &&
        Array.isArray(messageDiff[0]) &&
        typeof messageDiff[1] == 'object'
    ) {
        let newMessageIdxs = Object.keys(messageDiff[1]);
        newMessageIdxs.forEach((idx) => {
            let idxNum = Number(idx);
            if (Number.isInteger(idxNum) && searchMessageForString(messageDiff[1][idx], string)) {
                messageCount++;
            }
        });
    }
    return messageCount;
}

function searchMessageForString(message, string) {
    if (Array.isArray(message)) {
        return message.some((m) => searchMessageForString(m, string));
    } else if (typeof message == 'object') {
        for (let k in message) {
            if (k == 'message') {
                return searchMessageForString(message[k], string);
            }
        }
    } else {
        return typeof message == 'string' && message == string;
    }
}

function getPlayerAmberDiff(player) {
    if (
        player &&
        player.stats &&
        player.stats.amber &&
        Array.isArray(player.stats.amber) &&
        Array.isArray(player.stats.amber[1]) &&
        typeof player.stats.amber[1][0] == 'number' &&
        typeof player.stats.amber[1][1] == 'number'
    ) {
        // diffs are represented by arrays
        return player.stats.amber[1][1] - player.stats.amber[1][0];
    } else return 0;
}

function getPlayerCardsInPlayAmberTokenDiff(player) {
    let cardsInPlayAmberDiff = 0;
    // if the first element in the cards in play array is an array,
    // then the second element is an object with key-values of diffs in the cards in play array
    // (the key is the position of the change in the cards in play array)
    if (
        player.cardPiles &&
        player.cardPiles.cardsInPlay &&
        Array.isArray(player.cardPiles.cardsInPlay[0])
    ) {
        let cardsInPlayDiff = player.cardPiles.cardsInPlay[1];
        Object.keys(cardsInPlayDiff).forEach((k) => {
            let d = cardsInPlayDiff[k];
            let c = Array.isArray(d) ? d[0] : d;
            if (c.tokens) {
                let amber = c.tokens['amber'];
                if (typeof amber == 'number') {
                    if (k.substring(0, 1) == '_') cardsInPlayAmberDiff -= amber;
                    // the card was removed from play
                    else cardsInPlayAmberDiff += amber; // the card was put in play
                } else if (Array.isArray(amber) && amber.length > 1) {
                    cardsInPlayAmberDiff += amber[1] - amber[0]; // the tokens on the card changed
                } else if (Array.isArray(amber) && amber.length == 1) {
                    cardsInPlayAmberDiff += amber[0];
                }
            }
        });
    }
    return cardsInPlayAmberDiff;
}

export function setRootState(game) {
    return {
        type: 'SET_ROOT_STATE',
        state: game
    };
}

export function gameSocketClosed(message) {
    return {
        type: 'GAME_SOCKET_CLOSED',
        message: message
    };
}

export function gameSocketClose() {
    return (dispatch) => {
        return dispatch(gameSocketClosed());
    };
}

export function closeGameSocket() {
    return (dispatch, getState) => {
        let state = getState();

        if (state.games.socket) {
            state.games.socket.gameClosing = true;
            state.games.socket.close();
        }

        return dispatch(gameSocketClosed());
    };
}

export function gameStarting() {
    return {
        type: 'GAME_STARTING'
    };
}

export function startGame(id) {
    return (dispatch, getState) => {
        let state = getState();

        if (state.lobby.socket) {
            state.lobby.socket.emit('startgame', id);
        }

        return dispatch(gameStarting());
    };
}

export function leaveGame(id) {
    return (dispatch, getState) => {
        let state = getState();

        if (state.lobby.socket) {
            state.lobby.socket.emit('leavegame', id);
        }

        return dispatch(gameSocketClose());
    };
}
