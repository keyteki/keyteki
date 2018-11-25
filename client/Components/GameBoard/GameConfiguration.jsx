import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../Form/Checkbox';
import Panel from '../Site/Panel';

class GameConfiguration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <div>
                <form className='form form-horizontal'>
                    <Panel title='Other Settings' />
                </form>
            </div>
        );
    }
}

GameConfiguration.displayName = 'GameConfiguration';
GameConfiguration.propTypes = {
};

export default GameConfiguration;
