import { combineReducers } from 'redux';
import navigation from './navigation';
import auth from './auth';
import cards from './cards';

const rootReducer = combineReducers({
    navigation, auth, cards
});

export default rootReducer;
