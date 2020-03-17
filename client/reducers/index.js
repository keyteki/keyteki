import { combineReducers } from 'redux';
import navigation from './navigation';
import auth from './auth';
import cards from './cards';
import games from './games';
import news from './news';
import api from './api';
import admin from './admin';
import user from './user';
import account from './account';
import lobby from './lobby';
import deckbuilder from './deckbuilder'
import { reducer as toastrReducer } from 'react-redux-toastr';

const rootReducer = combineReducers({
    navigation, auth, cards, games, news, toastr: toastrReducer, api, admin, user, account, lobby, deckbuilder
});

export default rootReducer;
