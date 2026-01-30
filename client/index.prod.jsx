import React from 'react';
import { createRoot } from 'react-dom/client';
import Application from './Application';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { navigate } from './redux/actions';
import 'bootstrap/dist/js/bootstrap';
import { ToastContainer } from 'react-toastify';
import * as Sentry from '@sentry/browser';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import ErrorBoundary from './Components/Site/ErrorBoundary';

import './i18n';

const sentryOptions = {
    dsn: 'https://8e2615acba9548ba8d83fa2735de2bd2@sentry.io/1515148',
    denyUrls: [
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
        /chrome-extension:/i,
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
    release: import.meta.env.VERSION || 'Local build'
};

Sentry.init(sentryOptions);

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search, true));

window.onpopstate = function (e) {
    store.dispatch(navigate(e.target.location.pathname, null, true));
};

const container = document.getElementById('component');
const root = createRoot(container);

root.render(
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <Provider store={store}>
            <div className='body'>
                <ToastContainer
                    autoClose={4000}
                    newestOnTop
                    position='top-right'
                    pauseOnFocusLoss
                />
                <ErrorBoundary
                    message={
                        "We're sorry, a critical error has occured in the client and we're unable to show you anything.  Please try refreshing your browser after filling out a report."
                    }
                >
                    <Application />
                </ErrorBoundary>
            </div>
        </Provider>
    </DndProvider>
);
