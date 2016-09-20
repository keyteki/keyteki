import { combineReducers } from 'redux';
import navigation from './navigation';
import auth from './auth';

const rootReducer = combineReducers({
    navigation, auth
});

export default rootReducer;
