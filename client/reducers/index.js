import { combineReducers } from 'redux';
import navigation from './navigation';
import auth from './auth';
import cards from './cards';
import games from './games';
import socket from './socket';

const rootReducer = combineReducers({
    navigation, auth, cards, games, socket
});

export default rootReducer;
