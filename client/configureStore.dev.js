import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

import callAPIMiddleware from './middleware/api-middleware.js';

const windowIfDefined = typeof window === 'undefined' ? null : window;
const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension;
const enhancer = compose(
    applyMiddleware(thunkMiddleware, callAPIMiddleware),
    devToolsExtension ? devToolsExtension() : (next) => next
);

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, enhancer);

    if(module.hot) {
        module.hot.accept('./reducers', () =>
            store.replaceReducer(require('./reducers').default)
        );
    }

    return store;
}
