/*global user, authToken, Raven */
import React from 'react';
import {render} from 'react-dom';
import Application from './Application.jsx';
import {Provider} from 'react-redux';
import configureStore from './configureStore';
import {navigate, login} from './actions';
import 'bootstrap/dist/js/bootstrap';
import ReduxToastr from 'react-redux-toastr';

import version from '../version.js';

Raven.config('https://f5286cd580bf46898e7180c7a46de2f6@sentry.io/123019', { release: version}).install();

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search));

if(typeof user !== 'undefined') {
    store.dispatch(login(user, authToken, user.admin));
}

render(
    <Provider store={store}>
        <div>
            <ReduxToastr
                timeOut={4000}
                newestOnTop
                preventDuplicates
                position='top-right'
                transitionIn='fadeIn'
                transitionOut='fadeOut'/>
            <Application />
        </div>
    </Provider>, document.getElementById('component'));
