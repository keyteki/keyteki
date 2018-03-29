import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import Raven from 'raven-js';
import createRavenMiddleware from 'raven-for-redux';

import callAPIMiddleware from './middleware/api-middleware.js';

const enhancer = compose(
    applyMiddleware(thunkMiddleware, callAPIMiddleware)
);

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, enhancer);

    return store;
}
