import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { navigate } from './redux/actions';
import 'bootstrap/dist/js/bootstrap';
import ReduxToastr from 'react-redux-toastr';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';

import './i18n';

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search, true));

window.onpopstate = function (e) {
    store.dispatch(navigate(e.target.location.pathname, null, true));
};

const render = () => {
    const Application = require('./Application').default;
    ReactDOM.render(
        <Provider store={store}>
            <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
                <div className='body'>
                    <ReduxToastr
                        timeOut={4000}
                        newestOnTop
                        preventDuplicates
                        position='top-right'
                        transitionIn='fadeIn'
                        transitionOut='fadeOut'
                    />
                    <Application />
                </div>
            </DndProvider>
        </Provider>,
        document.getElementById('component')
    );
};

if (module.hot) {
    module.hot.accept('./Application', () => {
        setTimeout(render);
    });
}

render();
