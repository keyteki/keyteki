/*global user, authToken */
import React from 'react';
import {render} from 'react-dom';
import Application from './Application.jsx';
import {Provider} from 'react-redux';
import configureStore from './configureStore';
import {navigate, login} from './actions';
import DevTools from './DevTools';
import 'bootstrap/dist/js/bootstrap';

const store = configureStore();

store.dispatch(navigate(window.location.pathname));

if(typeof user !== 'undefined') {
    store.dispatch(login(user.username, authToken));
}

render(
    <Provider store={store}>
        <div>
            <Application />

            <DevTools />
        </div>
    </Provider>, document.getElementById('component'));
