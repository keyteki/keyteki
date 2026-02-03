import { addBreadcrumb } from '@sentry/browser';
import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './redux/reducers';
import callAPIMiddleware from './redux/middleware/api-middleware.js';
import { socketMiddleware } from './redux/middleware/socket-middleware';
import { api } from './redux/api';

const isProd = import.meta.env.PROD;
const composeEnhancers =
    !isProd && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

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

export default function configureStore(initialState) {
    const middleware = [thunkMiddleware, socketMiddleware, callAPIMiddleware, api.middleware];
    if (isProd) {
        middleware.push(sentryReporter);
    }

    const enhancer = composeEnhancers(applyMiddleware(...middleware));
    const store = createStore(rootReducer, initialState, enhancer);

    if (!isProd && import.meta.hot) {
        import.meta.hot.accept('./redux/reducers', (mod) => {
            store.replaceReducer(mod.default);
        });
    }

    return store;
}
