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
                let diff = patcher.diff(state.lobby.currentGame, game);
                if (
                    state.lobby.currentGame &&
                    Object.keys(state.lobby.currentGame.players).length == 2
                ) {
                    let amber = {
                        resolvedAmberBonusCount: 0,
                        reapCount: 0,
                        player: 0,
                        opponent: 0,
                        center: 0
                    };
                    amber.resolvedAmberBonusCount = searchMessageDiffForString(
                        diff,
                        ' gains an amber due to '
                    );
                    amber.reapCount = searchMessageDiffForString(diff, 'reap with ');

                    let playersDiff = Object.entries(diff.players);
                    let activePlayerUsername = state.lobby.currentGame.players[playersDiff[0][0]]
                        .activePlayer
                        ? state.lobby.currentGame.players[playersDiff[0][0]].user.username
                        : state.lobby.currentGame.players[playersDiff[1][0]].user.username;
                    let opponentUsername = state.lobby.currentGame.players[playersDiff[1][0]]
                        .activePlayer
                        ? state.lobby.currentGame.players[playersDiff[0][0]].user.username
                        : state.lobby.currentGame.players[playersDiff[1][0]].user.username;
                    amber.player = getPlayerAmberDiff(
                        state.lobby.currentGame.players[playersDiff[0][0]].activePlayer
                            ? playersDiff[0][1]
                            : playersDiff[1][1]
                    );
                    amber.opponent = getPlayerAmberDiff(
                        state.lobby.currentGame.players[playersDiff[1][0]].activePlayer
                            ? playersDiff[0][1]
                            : playersDiff[1][1]
                    );
                    amber.center = getPlayerCardsInPlayAmberTokenDiff(playersDiff[0][1]);
                    amber.center += getPlayerCardsInPlayAmberTokenDiff(playersDiff[1][1]);
                    console.log('patching game state', game, 'with resulting diff', diff);

                    let closedAnimations = {};

                    for (let i = 0; i < amber.resolvedAmberBonusCount; i++) {
                        count(closedAnimations, 'supply-to-player');
                    }
                    amber.player -= amber.resolvedAmberBonusCount;
                    amber.resolvedAmberBonusCount = 0;

                    for (let i = 0; i < amber.reapCount; i++) {
                        count(closedAnimations, 'supply-to-player-bounce');
                    }
                    amber.player -= amber.reapCount;
                    amber.reapCount = 0;

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

                    // if the player is changing the diff looks like [true, [true, false]], otherwise [true, 0, 0]
                    let isActivePlayerChanging =
                        !!playersDiff[0][1].activePlayer &&
                        Array.isArray(playersDiff[0][1].activePlayer[1]);
                    console.log(
                        'trying to determine if the active player has changed',
                        playersDiff[0][1].activePlayer,
                        playersDiff[1][1].activePlayer
                    );

                    let animations = [];
                    Object.entries(closedAnimations).forEach((closedAnimation) => {
                        let amount = closedAnimation[1] == undefined ? 1 : closedAnimation[1];
                        for (let i = 0; i < amount; i++) {
                            animations.push({
                                id: uniqueId(),
                                name: closedAnimation[0],
                                delay: i,
                                username: activePlayerUsername,
                                fromLastTurn: isActivePlayerChanging
                            });
                        }
                    });

                    console.log(
                        // 'From these counts',
                        // closedAnimationCounts,
                        'I recommend these animations:',
                        animations,
                        'to add to',
                        state.lobby.currentGame.animations
                    );
                    // bypass patching (because the game does not have an animations key? regardless, putting this stuff in 'game' and relying on patch didn't work)
                    if (Array.isArray(state.lobby.currentGame.animations)) {
                        let oldAnimations = state.lobby.currentGame.animations;
                        if (isActivePlayerChanging) {
                            console.log(
                                'active player is detected to have changed, removing',
                                oldAnimations.filter((a) => a.username == opponentUsername),
                                'from',
                                oldAnimations
                            );
                            // Clear a player's animations only until the turn is passed back to them.
                            // Otherwise, a player can end the turn quickly to delete animations and potentially gain an advantage.
                            oldAnimations = oldAnimations.filter(
                                (a) => a.username != opponentUsername
                            );
                        }
                        state.lobby.currentGame.animations = oldAnimations.concat(animations);
                    } else {
                        state.lobby.currentGame.animations = animations;
                    }
                }
                gameState = patcher.patch(state.lobby.currentGame, game);
                console.log(
                    'these are the current animations',
                    // gameState.animations,
                    state.lobby.currentGame.animations
                );
            } else {
                // console.log(
                //     'we are just setting the gamestate, not calculating animations, is it undefined though?',
                //     game.animations
                // );
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
