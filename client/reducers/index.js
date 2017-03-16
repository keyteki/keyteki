import { combineReducers } from 'redux';
import navigation from './navigation';
import auth from './auth';
import cards from './cards';
import games from './games';
import socket from './socket';
import chat from './chat';
import {reducer as toastrReducer} from 'react-redux-toastr';

const rootReducer = combineReducers({
    navigation, auth, cards, games, socket, chat, toastr: toastrReducer
});

export default rootReducer;
