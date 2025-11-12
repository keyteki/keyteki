/* eslint-env node */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/toast';
import $ from 'jquery';
import 'jquery-validation';
import 'jquery-validation-unobtrusive';

import configureStore from './store';
import { navigate } from './redux/slices/navigationSlice';
import Application from './Application';
import ErrorBoundary from './Components/Site/ErrorBoundary';

import './i18n';
import 'react-redux-toastr/src/styles/index.scss';
import './styles/tailwind.css';
import './styles/index.scss';

// jQuery validation defaults
$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function (element) {
        $(element).closest('.form-group').removeClass('has-error');
    }
});

// Initialize Sentry in production
const isProduction = import.meta && import.meta.env && import.meta.env.PROD;
if (isProduction) {
    import('@sentry/browser').then((Sentry) => {
        Sentry.init({
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
            release: process.env.VERSION || 'Local build'
        });
    });
}

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search, true));

window.onpopstate = function (e) {
    store.dispatch(navigate(e.target.location.pathname, null, true));
};

const container = document.getElementById('component');
if (!container) {
    throw new Error('Could not find root element with id "component"');
}
const root = createRoot(container);

// Apply dark mode to the document
document.documentElement.classList.add('dark');

const AppContent = isProduction ? (
    <ErrorBoundary
        message={
            "We're sorry, a critical error has occured in the client and we're unable to show you anything.  Please try refreshing your browser after filling out a report."
        }
    >
        <Application />
    </ErrorBoundary>
) : (
    <Application />
);

root.render(
    <HeroUIProvider>
        <ToastProvider placement='top-right' />
        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
            <Provider store={store}>
                <div className='body'>{AppContent}</div>
            </Provider>
        </DndProvider>
    </HeroUIProvider>
);
