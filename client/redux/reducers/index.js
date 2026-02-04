import { combineReducers } from 'redux';
import auth from '../slices/authSlice';
import cards from '../slices/cardsSlice';
import games from '../slices/gamesSlice';
import challonge from '../slices/challongeSlice';
import admin from '../slices/adminSlice';
import user from '../slices/userSlice';
import account from '../slices/accountSlice';
import lobby from '../slices/lobbySlice';
import { api as rtkApi } from '../api';

const rootReducer = combineReducers({
    auth,
    cards,
    games,
    challonge,
    admin,
    user,
    account,
    lobby,
    [rtkApi.reducerPath]: rtkApi.reducer
});

export default rootReducer;
