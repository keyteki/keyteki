import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { addBreadcrumb } from '@sentry/browser';

import rootReducer from './redux/reducers';
import callAPIMiddleware from './redux/middleware/api-middleware.js';
import { socketMiddleware } from './redux/middleware/socket-middleware';
import { api } from './redux/api';

const isProd = import.meta.env.PROD;
const sentryReporter = () => (next) => (action) => {
    addBreadcrumb({
        message: action.type,
        category: 'redux action',
        level: 'info',
        data: {
            payload: action.payload
        }
    });
    return next(action);
};

export default function configureStoreRTK(initialState) {
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
                immutableCheck: false
            }).concat(
                socketMiddleware,
                api.middleware,
                callAPIMiddleware,
                ...(isProd ? [sentryReporter] : [])
            ),
        preloadedState: initialState,
        devTools: !import.meta.env.PROD
    });
    setupListeners(store.dispatch);
    return store;
}
