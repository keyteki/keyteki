import { combineReducers } from 'redux';
import navigation from './navigation';
import auth from './auth';
import cards from './cards';
import games from './games';
import challonge from './challonge';
import news from './news';
import api from './api';
import admin from './admin';
import user from './user';
import account from './account';
import lobby from './lobby';

const rootReducer = combineReducers({
    navigation,
    auth,
    cards,
    games,
    news,
    challonge,
    api,
    admin,
    user,
    account,
    lobby
});

export default rootReducer;
