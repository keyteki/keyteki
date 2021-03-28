import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './redux/reducers';
import callAPIMiddleware from './redux/middleware/api-middleware.js';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunkMiddleware, callAPIMiddleware));

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, enhancer);

    if (module.hot) {
        module.hot.accept('./redux/reducers', () =>
            store.replaceReducer(require('./redux/reducers').default)
        );
    }

    return store;
}
