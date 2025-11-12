import { configureStore as createRTKStore } from '@reduxjs/toolkit';
import { addBreadcrumb } from '@sentry/browser';
import rootReducer from './redux/reducers';
import { api } from './redux/slices/apiSlice';
import socketMiddleware from './redux/middleware/socketMiddleware';
import gameSocketMiddleware from './redux/middleware/gameSocketMiddleware';

const isProduction = import.meta && import.meta.env && import.meta.env.PROD;

// Sentry middleware for production
const sentryMiddleware = () => (next) => (action) => {
    if (isProduction) {
        addBreadcrumb({
            message: action.type,
            category: 'redux action',
            level: 'info',
            data: {
                payload: action.payload
            }
        });
    }
    return next(action);
};

export default function configureStore(preloadedState) {
    const store = createRTKStore({
        reducer: rootReducer,
        preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                // RTK default middleware includes thunk, so no need to add it separately
                serializableCheck: {
                    // Ignore these action types for serializable check
                    ignoredActions: [
                        'socket/message',
                        'lobby/updateCurrentGame',
                        'lobby/lobbyConnecting',
                        'LOBBY_CONNECTING',
                        'LOBBY_MESSAGE_RECEIVED',
                        'GAME_SOCKET_CONNECTING',
                        'GAME_SOCKET_CONNECTED'
                    ],
                    // Ignore these field paths in all actions
                    ignoredActionPaths: [
                        'payload.socket',
                        'meta.arg.socket',
                        'meta.baseQueryMeta.request',
                        'meta.baseQueryMeta.response'
                    ],
                    ignoredPaths: ['lobby.socket', 'games.socket']
                }
            })
                .concat(api.middleware) // Add RTK Query middleware
                .concat(socketMiddleware) // Add lobby socket emission middleware
                .concat(gameSocketMiddleware) // Add game socket middleware
                .concat(sentryMiddleware),
        devTools: !isProduction,
        // Enable hot module replacement in development
        enhancers: (getDefaultEnhancers) => getDefaultEnhancers()
    });

    // Hot Module Replacement for reducers in development
    if (import.meta.hot && !isProduction) {
        import.meta.hot.accept('./redux/reducers', (newModule) => {
            if (newModule) {
                store.replaceReducer(newModule.default);
            }
        });
    }

    return store;
}
