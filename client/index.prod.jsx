import React from 'react';
import { render } from 'react-dom';
import Application from './Application';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { navigate } from './redux/actions';
import 'bootstrap/dist/js/bootstrap';
import ReduxToastr from 'react-redux-toastr';
import * as Sentry from '@sentry/browser';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';

import version from '../version';
import ErrorBoundary from './Components/Site/ErrorBoundary';

const sentryOptions = {
    dsn: 'https://8e2615acba9548ba8d83fa2735de2bd2@sentry.io/1515148',
    blacklistUrls: [
        // Facebook flakiness
        /graph\.facebook\.com/i,
        // Facebook blocked
        /connect\.facebook\.net\/en_US\/all\.js/i,
        // Woopra flakiness
        /eatdifferent\.com\.woopra-ns\.com/i,
        /static\.woopra\.com\/js\/woopra\.js/i,
        // Chrome extensions
        /extensions\//i,
        /^chrome:\/\//i,
        // Other plugins
        /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
        /webappstoolbarba\.texthelp\.com\//i,
        /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
        /YoukuAntiAds\.eval/i
    ],
    beforeSend(event, hint) {
        if (
            event.message &&
            event.message.startsWith('Non-Error exception captured') &&
            hint.originalException.error
        ) {
            Sentry.withScope((scope) => {
                scope.setExtra('nonErrorException', true);
                Sentry.captureException(hint.originalException.error);
            });
            return null;
        }

        return event;
    },
    release: version.build
};

Sentry.init(sentryOptions);

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search, true));

window.onpopstate = function (e) {
    store.dispatch(navigate(e.target.location.pathname, null, true));
};

const DnDContainer = DragDropContext(TouchBackend({ enableMouseEvents: true }))(Application);

render(
    <Provider store={store}>
        <div className='body'>
            <ReduxToastr
                timeOut={4000}
                newestOnTop
                preventDuplicates
                position='top-right'
                transitionIn='fadeIn'
                transitionOut='fadeOut'
            />
            <ErrorBoundary
                message={
                    "We're sorry, a critical error has occured in the client and we're unable to show you anything.  Please try refreshing your browser after filling out a report."
                }
            >
                <DnDContainer />
            </ErrorBoundary>
        </div>
    </Provider>,
    document.getElementById('component')
);
