import $ from 'jquery';

export function navigate(path, search) {
    return {
        type: 'NAVIGATE',
        newPath: path,
        search: search
    };
}

export function setContextMenu(menu) {
    return {
        type: 'SET_CONTEXT_MENU',
        menu: menu
    };
}

export function register(username, token) {
    return {
        type: 'AUTH_REGISTER',
        username: username,
        token: token
    };
}

export function login(username, token, isAdmin) {
    return {
        type: 'AUTH_LOGIN',
        username: username,
        token: token,
        isAdmin: isAdmin
    };
}

export function logout() {
    return {
        type: 'AUTH_LOGOUT'
    };
}

export function requestCards() {
    return {
        type: 'REQUEST_CARDS'
    };
}

export function receiveCards(cards) {
    return {
        type: 'RECEIVE_CARDS',
        cards: cards
    };
}

export function fetchCards() {
    return dispatch => {
        dispatch(requestCards());

        return $.ajax('/api/cards')
            .done(function(data) {
                dispatch(receiveCards(data.cards));
            });
    };
}

export function requestPacks() {
    return {
        type: 'REQUEST_PACKS'
    };
}

export function receivePacks(packs) {
    return {
        type: 'RECEIVE_PACKS',
        packs: packs
    };
}

export function fetchPacks() {
    return dispatch => {
        dispatch(requestPacks());

        return $.ajax('/api/packs')
            .done(function(data) {
                dispatch(receivePacks(data.packs));
            });
    };
}

export function receiveGames(games) {
    return {
        type: 'RECEIVE_GAMES',
        games: games
    };
}

export function receiveUsers(users) {
    return {
        type: 'RECEIVE_USERS',
        users: users
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

export function socketConnected(socket) {
    return {
        type: 'SOCKET_CONNECTED',
        socket: socket
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

export function receiveLobbyMessage(message) {
    return {
        type: 'RECEIVE_LOBBY_MSG',
        message: message
    };
}

export function receiveLobbyMessages(messages) {
    return {
        type: 'RECEIVE_LOBBY_MSGS',
        messages: messages
    };
}

export function zoomCard(card) {
    return {
        type: 'ZOOM_CARD',
        card: card
    };
}

export function clearZoom() {
    return {
        type: 'CLEAR_ZOOM'
    };
}

export function socketMessageSent(message) {
    return {
        type: 'SOCKET_MESSAGE_SENT',
        message: message
    };
}

export function sendSocketMessage(message, ...args) {
    return (dispatch, getState) => {
        var state = getState();

        state.socket.socket.emit(message, ...args);

        return dispatch(socketMessageSent(message));
    };
}

export function sendGameMessage(message, ...args) {
    return (dispatch, getState) => {
        var state = getState();

        state.socket.gameSocket.emit('game', message, ...args);

        return dispatch(socketMessageSent(message));
    };
}

export function gameSocketConnected(socket) {
    return {
        type: 'GAME_SOCKET_CONNECTED',
        socket: socket
    };
}

export function receiveBannerNotice(notice) {
    return {
        type: 'RECEIVE_BANNER_NOTICE',
        notice: notice
    };
}

export function gameSocketConnectError() {
    return {
        type: 'GAME_SOCKET_CONNECT_ERROR'
    };
}

export function gameSocketDisconnect() {
    return {
        type: 'GAME_SOCKET_DISCONNETED'
    };
}

export function gameSocketReconnecting() {
    return {
        type: 'GAME_SOCKET_RECONNECTED'
    };
}

export function gameSocketConnecting(host) {
    return {
        type: 'GAME_SOCKET_CONNECTING',
        host: host
    };
}

export function gameSocketConnectFailed() {
    return {
        type: 'GAME_SOCKET_CONNECT_FAILED'
    };
}

export function sendGameSocketConnectFailed() {
    return (dispatch, getState) => {
        var state = getState();

        if(state.socket.socket) {
            state.socket.socket.emit('connectfailed');
        }

        return dispatch(gameSocketConnectFailed());
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

export function fetchNews() {
    return dispatch => {
        dispatch(requestNews());

        return $.ajax('/api/news')
            .done(function(data) {
                dispatch(receiveNews(data));
            });
    };
}

export function requestNews() {
    return {
        type: 'REQUEST_NEWS'
    };
}

export function receiveNews(news) {
    return {
        type: 'RECEIVE_NEWS',
        news: news
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
