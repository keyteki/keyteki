import { combineReducers } from 'redux';
import navigation from './navigation';
import auth from './auth';
import cards from './cards';
import games from './games';
import socket from './socket';
import chat from './chat';
import news from './news';
import api from './api';
import {reducer as toastrReducer} from 'react-redux-toastr';

const rootReducer = combineReducers({
    navigation, auth, cards, games, socket, chat, news, toastr: toastrReducer, api
});

export default rootReducer;
