/*global user */
import React from 'react';
import {render} from 'react-dom';
import Application from './Application.jsx';
import {Provider} from 'react-redux';
import configureStore from './configureStore';
import {navigate, login} from './actions';
import DevTools from './DevTools';

const store = configureStore();

store.dispatch(navigate(window.location.pathname));

if(user) {
    store.dispatch(login());
}

render(
    <Provider store={store}>
        <div>
            <Application />

            <DevTools />
        </div>
    </Provider>, document.getElementById('component'));
