import React from 'react';
import { render } from 'react-dom';
import Application from './Application';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { navigate } from './actions';
import 'bootstrap/dist/js/bootstrap';
import ReduxToastr from 'react-redux-toastr';
import Raven from 'raven-js';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';

import version from '../version';
import ErrorBoundary from './Components/Site/ErrorBoundary';

const ravenOptions = {
    ignoreErrors: [
        // Random plugins/extensions
        'top.GLOBALS',
        // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error. html
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        'http://tt.epicplay.com',
        'Can\'t find variable: ZiteReader',
        'jigsaw is not defined',
        'ComboSearch is not defined',
        'http://loading.retry.widdit.com/',
        'atomicFindClose',
        // Facebook borked
        'fb_xd_fragment',
        // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
        // reduce this. (thanks @acdha)
        // See http://stackoverflow.com/questions/4113268
        'bmi_SafeAddOnload',
        'EBCallBackMessageReceived',
        // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
        'conduitPage',
        'YoukuAntiAds.eval'
    ],
    ignoreUrls: [
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
    release: version
};

Raven.config('https://a58875107284492dafce641d2d9f85c5@sentry.io/1268981', ravenOptions)
    .install();

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search));

window.onpopstate = function(e) {
    store.dispatch(navigate(e.target.location.pathname));
};

const DnDContainer = DragDropContext(TouchBackend({ enableMouseEvents: true }))(Application);

render(
    <Provider store={ store }>
        <div className='body'>
            <ReduxToastr
                timeOut={ 4000 }
                newestOnTop
                preventDuplicates
                position='top-right'
                transitionIn='fadeIn'
                transitionOut='fadeOut' />
            <ErrorBoundary message={ 'We\'re sorry, a critical error has occured in the client and we\'re unable to show you anything.  Please try refreshing your browser after filling out a report.' }>
                <DnDContainer />
            </ErrorBoundary>
        </div>
    </Provider>, document.getElementById('component'));
