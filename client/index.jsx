import '@babel/polyfill';
import $ from 'jquery';
import 'react-toastify/dist/ReactToastify.css';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './styles/index.scss';

window.jQuery = $;
window.$ = $;

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from './configureStore.rtk';
import 'bootstrap/dist/js/bootstrap';
import { ToastContainer } from 'react-toastify';
import * as Sentry from '@sentry/react';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import Application from './Application';
import ErrorBoundary from './Components/Site/ErrorBoundary';

import './i18n';

const ensureJqueryPlugins = async () => {
    window.jQuery = $;
    window.$ = $;
    await import('jquery-migrate');
    await import('jquery-validation');
    await import('jquery-validation-unobtrusive');
    $.validator.setDefaults({
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        }
    });
};

const isProd = import.meta.env.PROD;
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (isProd && sentryDsn) {
    const sentryOptions = {
        dsn: sentryDsn,
        denyUrls: [
            /graph\.facebook\.com/i,
            /connect\.facebook\.net\/en_US\/all\.js/i,
            /eatdifferent\.com\.woopra-ns\.com/i,
            /static\.woopra\.com\/js\/woopra\.js/i,
            /extensions\//i,
            /^chrome:\/\//i,
            /chrome-extension:/i,
            /127\.0\.0\.1:4001\/isrunning/i,
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
        release: import.meta.env.VITE_VERSION || 'Local build',
        environment: import.meta.env.MODE
    };

    Sentry.init(sentryOptions);
}

let ApplicationComponent = Application;
let root;
let store;

const render = async () => {
    await ensureJqueryPlugins();
    if (!store) {
        store = configureStore();
    }
    const App = ApplicationComponent;
    if (!root) {
        const container = document.getElementById('component');
        root = createRoot(container);
    }

    const content = isProd ? (
        <ErrorBoundary
            message={
                "We're sorry, a critical error has occured in the client and we're unable to show you anything.  Please try refreshing your browser after filling out a report."
            }
        >
            <App />
        </ErrorBoundary>
    ) : (
        <App />
    );

    root.render(
        <Provider store={store}>
            <BrowserRouter>
                <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
                    <div className='body'>
                        <ToastContainer
                            autoClose={4000}
                            newestOnTop
                            position='top-right'
                            pauseOnFocusLoss
                        />
                        {content}
                    </div>
                </DndProvider>
            </BrowserRouter>
        </Provider>
    );
};

if (!isProd && import.meta.hot) {
    import.meta.hot.accept('./Application', (mod) => {
        ApplicationComponent = mod.default;
        setTimeout(render);
    });
}

render();
