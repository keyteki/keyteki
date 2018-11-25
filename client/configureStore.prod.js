import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import Raven from 'raven-js';
import createRavenMiddleware from 'raven-for-redux';

import callAPIMiddleware from './middleware/api-middleware.js';

const enhancer = compose(
    applyMiddleware(thunkMiddleware, callAPIMiddleware, createRavenMiddleware(Raven, {
        stateTransformer: state => {
            let ret = Object.assign({}, state);
            delete ret.auth;

            delete ret.cards.cards;
            delete ret.cards.factions;
            delete ret.account.user.email;

            return ret;
        }
    })));

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, enhancer);

    return store;
}
