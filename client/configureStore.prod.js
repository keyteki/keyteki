import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import Raven from 'raven-js';
import createRavenMiddleware from 'raven-for-redux';
import _ from 'underscore';

import callAPIMiddleware from './middleware/api-middleware.js';

const enhancer = compose(
    applyMiddleware(thunkMiddleware, callAPIMiddleware, createRavenMiddleware(Raven, {
        stateTransformer: state => {
            let ret = _.omit(state, 'auth');

            ret.cards = _.omit(ret.cards, 'alliances', 'cards', 'factions', 'packs');
            return ret;
        }
    })));

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, enhancer);

    return store;
}
