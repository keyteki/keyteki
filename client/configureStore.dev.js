import { applyMiddleware, createStore, compose } from 'redux';
import { persistState } from 'redux-devtools';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import DevTools from './DevTools';

import callAPIMiddleware from './middleware/api-middleware.js';

const enhancer = compose(
    applyMiddleware(thunkMiddleware, callAPIMiddleware),
    DevTools.instrument(),
    persistState(getDebugSessionKey())
);

function getDebugSessionKey() {
    const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
    return (matches && matches.length > 0) ? matches[1] : null;
}

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, enhancer);

    if(module.hot) {
        module.hot.accept('./reducers', () =>
            store.replaceReducer(require('./reducers').default)
        );
    }

    return store;
}
