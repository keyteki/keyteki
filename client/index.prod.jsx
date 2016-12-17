/*global user, authToken, Raven */
import React from 'react';
import {render} from 'react-dom';
import Application from './Application.jsx';
import {Provider} from 'react-redux';
import configureStore from './configureStore';
import {navigate, login} from './actions';
import 'bootstrap/dist/js/bootstrap';

Raven.config('https://f5286cd580bf46898e7180c7a46de2f6@sentry.io/123019', { release: 'dev'}).install();

const store = configureStore();

store.dispatch(navigate(window.location.pathname));

if(typeof user !== 'undefined') {
    store.dispatch(login(user.username, authToken));
}

render(
    <Provider store={store}>
        <div>
            <Application />
        </div>
    </Provider>, document.getElementById('component'));
