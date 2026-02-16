import '@babel/polyfill';
import $ from 'jquery';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './styles/tailwind.css';
import './styles/index.scss';

window.jQuery = $;
window.$ = $;

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toast } from '@heroui/react';
import configureStore from './configureStore.rtk';
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

const THEME_STORAGE_KEY = 'keyteki-theme';

const applyTheme = (theme) => {
    const resolvedTheme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.classList.remove('light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add(resolvedTheme);
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);
};

const initializeTheme = () => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === 'light' || storedTheme === 'dark') {
        applyTheme(storedTheme);
        return;
    }

    const prefersDark =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
};

const registerThemeHelpers = () => {
    window.setAppTheme = (theme) => applyTheme(theme);
    window.toggleAppTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    };
};

const render = async () => {
    await ensureJqueryPlugins();
    initializeTheme();
    registerThemeHelpers();
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
                        <Toast.Provider placement='top end' />
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
