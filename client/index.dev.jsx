import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from './configureStore';
import 'bootstrap/dist/js/bootstrap';
import { ToastContainer } from 'react-toastify';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import Application from './Application';

import './i18n';

const store = configureStore();

let ApplicationComponent = Application;
let root;

const render = () => {
    const App = ApplicationComponent;
    if (!root) {
        const container = document.getElementById('component');
        root = createRoot(container);
    }

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
                        <App />
                    </div>
                </DndProvider>
            </BrowserRouter>
        </Provider>
    );
};

if (import.meta.hot) {
    import.meta.hot.accept('./Application', (mod) => {
        ApplicationComponent = mod.default;
        setTimeout(render);
    });
}

render();
