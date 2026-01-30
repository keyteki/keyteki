import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { navigate } from './redux/actions';
import 'bootstrap/dist/js/bootstrap';
import ReduxToastr from 'react-redux-toastr';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import Application from './Application';

import './i18n';

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search, true));

window.onpopstate = function (e) {
    store.dispatch(navigate(e.target.location.pathname, null, true));
};

let ApplicationComponent = Application;

const render = () => {
    const App = ApplicationComponent;
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
                    <App />
                </div>
            </DndProvider>
        </Provider>,
        document.getElementById('component')
    );
};

if (import.meta.hot) {
    import.meta.hot.accept('./Application', (mod) => {
        ApplicationComponent = mod.default;
        setTimeout(render);
    });
}

render();
