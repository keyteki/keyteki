import React from 'react';
import {render} from 'react-dom';

class Application extends React.Component {
    render() {
        return (<div>
        </div>);
    }
}

if (!window.__karma__) {
    render(<Application />, document.getElementById('component'));
}

Application.displayName = 'Application';

export default Application;
