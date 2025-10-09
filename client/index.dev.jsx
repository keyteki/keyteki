import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { navigate } from './redux/actions';
import 'bootstrap/dist/js/bootstrap';
import ReduxToastr from 'react-redux-toastr';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HeroUIProvider } from '@heroui/react';
import Application from './Application.jsx';

import './i18n';

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

const render = () => {
    root.render(
        <HeroUIProvider>
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
            </Provider>
        </HeroUIProvider>
    );
};

render();
