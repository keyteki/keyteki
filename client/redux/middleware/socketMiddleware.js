/**
 * Socket middleware that handles socket.io connection management and emissions as side effects.
 *
 * This keeps reducers pure while centralizing socket management:
 * - Establishes socket.io connection when connectLobby action is dispatched
 * - Sets up event listeners for incoming socket messages
 * - Emits socket messages when specific actions are dispatched
 */
import io from 'socket.io-client';
import {
    lobbyConnecting,
    lobbyConnected,
    lobbyDisconnected,
    lobbyReconnecting,
    lobbyMessageReceived,
    responseTimeReceived,
    nodeStatusReceived
} from '../slices/lobbySlice';
import { handoffReceived, closeGameSocket, connectGameSocket } from '../slices/gamesSlice';
import { setAuthTokens } from '../slices/authSlice';
import { sendAuthenticate } from '../slices/lobbySlice';

// List of socket messages that follow the standard pattern (message -> lobbyMessageReceived)
const standardMessages = [
    'newgame',
    'removegame',
    'updategame',
    'games',
    'users',
    'newuser',
    'userleft',
    'lobbychat',
    'nochat',
    'passworderror',
    'lobbymessages',
    'banner',
    'motd',
    'cleargamestate',
    'gameerror'
];

/**
 * Sets up socket event listeners
 */
function setupSocketListeners(socket, store) {
    const { dispatch, getState } = store;

    socket.on('pong', (responseTime) => {
        dispatch(responseTimeReceived(responseTime));
    });

    socket.on('connect', () => {
        dispatch(lobbyConnected());
    });

    socket.on('disconnect', () => {
        dispatch(lobbyDisconnected());
    });

    socket.on('reconnect', () => {
        dispatch(lobbyReconnecting());
    });

    // Standard messages that dispatch directly to lobbyMessageReceived
    for (const message of standardMessages) {
        socket.on(message, (arg) => {
            dispatch(lobbyMessageReceived({ message, args: [arg] }));
        });
    }

    // Special message handlers
    socket.on('gamestate', (game) => {
        const state = getState();
        dispatch(
            lobbyMessageReceived({
                message: 'gamestate',
                args: [game, state.auth?.user?.username]
            })
        );
    });

    socket.on('handoff', (details) => {
        const state = getState();

        // Build game server URL
        let url =
            details.address && details.address !== 'undefined'
                ? '//' + details.address
                : '//' + window.location.hostname;
        let standardPorts = [80, 443];

        // Dispatch handoff received to update gameId
        dispatch(handoffReceived({ gameId: details.gameId }));

        // Add port if non-standard
        if (details.port && !standardPorts.some((p) => p === details.port)) {
            url += ':' + details.port;
        }

        // Update auth tokens
        dispatch(setAuthTokens(details.authToken, state.auth.refreshToken, details.user));

        // Close existing game socket if switching games
        if (state.games.socket && state.games.gameId !== details.gameId) {
            dispatch(closeGameSocket());
        }

        // Connect to new game socket
        dispatch(connectGameSocket({ url, name: details.name }));
    });

    socket.on('authfailed', () => {
        const state = getState();
        if (state.auth?.token) {
            dispatch(sendAuthenticate(state.auth.token));
        }
    });

    socket.on('nodestatus', (status) => {
        dispatch(nodeStatusReceived(status));
    });

    socket.on('removemessage', (messageId, deletedBy) => {
        dispatch(
            lobbyMessageReceived({
                message: 'removemessage',
                args: [messageId, deletedBy]
            })
        );
    });
}

const socketMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    // Handle lobby connection
    if (action.type === 'lobby/connectLobby') {
        // Don't reconnect if already connected
        if (state.lobby?.socket?.connected) {
            return result;
        }

        // Build query string
        let queryString = state.auth?.token ? 'token=' + state.auth.token + '&' : '';
        queryString += 'version=' + (process.env.VERSION || 'Local build');

        // Create socket connection
        const socket = io.connect(window.location.origin, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
            query: queryString
        });

        // Dispatch connecting action with socket
        store.dispatch(lobbyConnecting(socket));

        // Set up event listeners
        setupSocketListeners(socket, store);

        return result;
    }

    // Handle socket emission actions
    const socket = state.lobby?.socket;
    if (!socket) {
        return result;
    }

    // Handle socket emission actions
    switch (action.type) {
        case 'lobby/sendLobbyChat':
            socket.emit('lobbychat', action.payload);
            break;

        case 'lobby/sendAuthenticate':
            socket.emit('authenticate', action.payload);
            break;

        case 'lobby/sendGetNodeStatus':
            socket.emit('getnodestatus');
            break;

        case 'lobby/sendToggleNode':
            socket.emit('togglenode', action.payload);
            break;

        case 'lobby/sendRestartNode':
            socket.emit('restartnode', action.payload);
            break;

        case 'lobby/sendSetMotd':
            socket.emit('motd', action.payload);
            break;

        case 'lobby/sendJoinGame':
            socket.emit('joingame', action.payload);
            break;

        case 'lobby/sendWatchGame':
            socket.emit('watchgame', action.payload);
            break;

        case 'lobby/sendLeaveGame':
            socket.emit('leavegame', action.payload);
            break;

        case 'lobby/sendStartGame':
            socket.emit('startgame', action.payload);
            break;

        case 'lobby/sendSelectDeck':
            socket.emit(
                'selectdeck',
                action.payload.gameId,
                action.payload.deckId,
                action.payload.isStandalone
            );
            break;

        case 'lobby/sendNewGame':
            socket.emit('newgame', action.payload);
            break;

        case 'lobby/sendChatReadAcknowledge':
            socket.emit('chatreadack', action.payload);
            break;

        case 'lobby/sendRemoveGame':
            socket.emit('removegame', action.payload);
            break;

        case 'lobby/sendPasswordJoinGame': {
            const { gameId, password, joinType } = action.payload;
            socket.emit(joinType, gameId, password);
            break;
        }

        case 'lobby/sendChat':
            socket.emit('chat', action.payload);
            break;

        case 'lobby/sendGetSealedDeck':
            socket.emit('getsealeddeck', action.payload);
            break;

        case 'lobby/sendClearUserSessions':
            socket.emit('clearsessions', action.payload);
            break;

        case 'lobby/profileSavedLobby':
            socket.emit('authenticate', action.payload);
            break;

        default:
            break;
    }

    return result;
};

export default socketMiddleware;
