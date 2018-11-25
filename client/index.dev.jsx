import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { navigate } from './actions';
import 'bootstrap/dist/js/bootstrap';
import ReduxToastr from 'react-redux-toastr';
import { AppContainer } from 'react-hot-loader';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';

const store = configureStore();

store.dispatch(navigate(window.location.pathname, window.location.search));

window.onpopstate = function(e) {
    store.dispatch(navigate(e.target.location.pathname));
};

const DnDContainer = DragDropContext(TouchBackend({ enableMouseEvents: true }))(AppContainer);

const render = () => {
    const Application = require('./Application').default;
    ReactDOM.render(<DnDContainer>
        <Provider store={ store }>
            <div className='body'>
                <ReduxToastr
                    timeOut={ 4000 }
                    newestOnTop
                    preventDuplicates
                    position='top-right'
                    transitionIn='fadeIn'
                    transitionOut='fadeOut' />
                <Application />
            </div>
        </Provider>
    </DnDContainer>, document.getElementById('component'));
};

if(module.hot) {
    module.hot.accept('./Application', () => {
        setTimeout(render);
    });
}

render();
