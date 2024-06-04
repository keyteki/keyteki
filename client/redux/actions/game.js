import io from 'socket.io-client';
import * as jsondiffpatch from 'jsondiffpatch';

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
                // calculate changes in amber totals to identify source and destination of amber
                let diff = patcher.diff(state.lobby.currentGame, game);
                let amber = {
                    resolvedAmberBonusCount: 0,
                    reapCount: 0,
                    player1: 0,
                    player2: 0,
                    center1: 0,
                    center2: 0
                };
                // detect how many amber have been added from amber bonuses
                amber.resolvedAmberBonusCount = searchMessageDiffForString(
                    diff,
                    ' gains an amber due to '
                );
                // detect if a creature has reaped
                amber.reapCount = searchMessageDiffForString(diff, 'reap with ');
                // detect changes in user amber totals
                let players = Object.values(diff.players);
                amber.player1 = getPlayerAmberDiff(players[0]);
                amber.player2 = getPlayerAmberDiff(players[1]);
                // detect changes in cards in play that have amber tokens on them
                amber.center1 = getPlayerCreatureAmberTokenDiff(players[0]);
                amber.center2 = getPlayerCreatureAmberTokenDiff(players[1]);
                // detect changes in amber tokens on cards in play
                console.log('patching game state', diff); // , amber.resolvedAmberBonusCount, amber.reapCount, amber.player1, amber.player2Diff, amber.center1Diff, amber.center2Diff);
                let animations = [];
                for (let i = 0; i < amber.resolvedAmberBonusCount; i++) {
                    animations.push('supply-to-player');
                    amber.resolvedAmberBonusCount--;
                    amber.player1--;
                }
                for (let i = 0; i < amber.reapCount; i++) {
                    animations.push('supply-to-player-bounce');
                    amber.reapCount--;
                    amber.player1--;
                }
                let openAnimations = [];
                Object.entries(amber).forEach((e) => {
                    console.log('making animation', e);
                    for (let i = 0; i > e[1]; i--) {
                        openAnimations.push(e[0] + '-to-');
                    }
                });
                Object.entries(amber).forEach((e) => {
                    for (let i = 0; i < e[1]; i++) {
                        let a = openAnimations.pop();
                        if (a) animations.push(a + e[0]);
                        else animations.push('supply-to-' + e[0]);
                        console.log(
                            'entry',
                            e,
                            'made animation',
                            animations[animations.length - 1]
                        );
                    }
                });
                openAnimations.forEach((a) => {
                    animations.push(a + 'supply');
                });
                console.log(
                    'This amber changed',
                    amber,
                    ' and I recommend these animations:',
                    animations
                );
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

function searchMessageDiffForString(diff, string) {
    let messageDiff = diff.messages;
    let messageCount = 0;
    if (
        Array.isArray(messageDiff) &&
        Array.isArray(messageDiff[0]) &&
        typeof messageDiff[1] == 'object'
    ) {
        console.log('message diff', messageDiff);
        let newMessageIdxs = Object.keys(messageDiff[1]);
        console.log('new message idxs', newMessageIdxs);
        newMessageIdxs.forEach((idx) => {
            let idxNum = Number(idx);
            console.log('idxNum', idxNum);
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
                // return message[k].some(m => searchMessageForString(m, string));
            }
        }
    } else {
        return typeof message == 'string' && message == string;
    }
}

function getPlayerAmberDiff(player) {
    console.log('getting player amber diff');
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

function getPlayerCreatureAmberTokenDiff(player) {
    console.log('getting player creature diff', player.cardPiles.cardsInPlay);
    let creatureAmberDiff = 0;
    // if the first element in the cards in play array is an array,
    // then the second element is an object with key-values of diffs in the cards in play array
    // (the key is the position of the change in the cards in play array)
    if (player.cardPiles.cardsInPlay && Array.isArray(player.cardPiles.cardsInPlay[0])) {
        let creatureDiff = player.cardPiles.cardsInPlay[1];
        Object.keys(creatureDiff).forEach((k) => {
            let d = creatureDiff[k];
            console.log('getting creature diff', k, d);
            let c = Array.isArray(d) ? d[0] : d;
            if (c.tokens) {
                let amber = c.tokens['amber'];
                if (typeof amber == 'number') {
                    if (k.substring(0, 1) == '_') creatureAmberDiff -= amber;
                    // the creature was removed from play
                    else creatureAmberDiff += amber; // the creature was put in play
                } else if (Array.isArray(amber) && amber.length == 2) {
                    creatureAmberDiff += amber[1] - amber[0]; // the tokens on the creature changed
                } else if (Array.isArray(amber) && amber.length == 1) {
                    creatureAmberDiff += amber[0];
                }
            }
        });
    }
    return creatureAmberDiff;
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
