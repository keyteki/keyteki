import { combineReducers } from 'redux';
import auth from './auth';
import cards from './cards';
import games from '../slices/gamesSlice';
import challonge from './challonge';
import apiReducer from './api';
import admin from './admin';
import user from './user';
import account from './account';
import lobby from '../slices/lobbySlice';
import { api as rtkApi } from '../api';

const rootReducer = combineReducers({
    auth,
    cards,
    games,
    challonge,
    api: apiReducer,
    admin,
    user,
    account,
    lobby,
    [rtkApi.reducerPath]: rtkApi.reducer
});

export default rootReducer;
