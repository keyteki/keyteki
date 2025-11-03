import { combineReducers } from '@reduxjs/toolkit';
import navigationReducer from '../slices/navigationSlice';
import authReducer from '../slices/authSlice';
import lobbyReducer from '../slices/lobbySlice';
import gamesReducer from '../slices/gamesSlice';
import accountReducer from '../slices/accountSlice';
import newsReducer from '../slices/newsSlice';
import adminReducer from '../slices/adminSlice';
import { api } from '../slices/apiSlice';
import cards from '../slices/cardsSlice';
import { reducer as toastrReducer } from 'react-redux-toastr';

const rootReducer = combineReducers({
    navigation: navigationReducer,
    auth: authReducer,
    cards,
    games: gamesReducer,
    news: newsReducer,
    toastr: toastrReducer,
    [api.reducerPath]: api.reducer, // RTK Query reducer
    admin: adminReducer,
    account: accountReducer,
    lobby: lobbyReducer
});

export default rootReducer;
