import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import Checkbox from '../FormComponents/Checkbox.jsx';

class GameConfiguration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            windowTimer: this.props.timerSettings.windowTimer
        };
    }

    onToggle(option, value) {
        if(this.props.onToggle) {
            this.props.onToggle(option, !value);
        }
    }

    onSlideStop(event) {
        let value = parseInt(event.target.value);

        if(_.isNaN(value)) {
            return;
        }

        if(value < 0) {
            value = 0;
        }

        if(value > 10) {
            value = 10;
        }

        this.setState({ windowTimer: value });
    }

    onTimerSettingToggle(option, event) {
        if(this.props.onTimerSettingToggle) {
            this.props.onTimerSettingToggle(option, event.target.checked);
        }
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
                    <div className='panel-title text-center'>
                        Options
                    </div>
                    <div className='panel'>
                        <div className='form-group'>
                            <Checkbox
                                name='optionSettings.markCardsUnselectable'
                                noGroup
                                label={ 'Grey out cards with no relevant abilities during interrupt/reaction windows' }
                                fieldClass='col-sm-6'
                                onChange={ this.onOptionSettingToggle.bind(this, 'markCardsUnselectable') }
                                checked={ this.props.optionSettings.markCardsUnselectable }
                            />
                            <Checkbox
                                name='optionSettings.orderForcedAbilities'
                                noGroup
                                label={ 'Prompt to order forced triggered/simultaneous abilities' }
                                fieldClass='col-sm-6'
                                onChange={ this.onOptionSettingToggle.bind(this, 'orderForcedAbilities') }
                                checked={ this.props.optionSettings.orderForcedAbilities }
                            />
                            <Checkbox
                                name='optionSettings.confirmOneClick'
                                noGroup
                                label={ 'Show a confirmation prompt when initating 1-click abilities' }
                                fieldClass='col-sm-6'
                                onChange={ this.onOptionSettingToggle.bind(this, 'confirmOneClick') }
                                checked={ this.props.optionSettings.confirmOneClick }
                            />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

GameConfiguration.displayName = 'GameConfiguration';
GameConfiguration.propTypes = {
    actionWindows: PropTypes.object,
    onOptionSettingToggle: PropTypes.func,
    onTimerSettingToggle: PropTypes.func,
    onToggle: PropTypes.func,
    optionSettings: PropTypes.object,
    timerSettings: PropTypes.object
};

export default GameConfiguration;
