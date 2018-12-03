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

    onOptionSettingToggle(option, event) {
        if(this.props.onOptionSettingToggle) {
            this.props.onOptionSettingToggle(option, event.target.checked);
        }
    }

    render() {
        return (
            <div>
                <form className='form form-horizontal'>
                    <Panel title='Game Settings'>
                        <div className='form-group'>
                            <Checkbox
                                name='optionSettings.orderForcedAbilities'
                                noGroup
                                label={ 'Prompt to order simultaneous abilities' }
                                fieldClass='col-sm-6'
                                onChange={ this.onOptionSettingToggle.bind(this, 'orderForcedAbilities') }
                                checked={ this.props.optionSettings.orderForcedAbilities } />
                            <Checkbox
                                name='optionSettings.confirmOneClick'
                                noGroup
                                label={ 'Show a prompt when initating 1-click abilities' }
                                fieldClass='col-sm-6'
                                onChange={ this.onOptionSettingToggle.bind(this, 'confirmOneClick') }
                                checked={ this.props.optionSettings.confirmOneClick } />
                        </div>
                    </Panel>
                </form>
            </div>
        );
    }
}

GameConfiguration.displayName = 'GameConfiguration';
GameConfiguration.propTypes = {
    onOptionSettingToggle: PropTypes.func,
    optionSettings: PropTypes.object
};

export default GameConfiguration;
