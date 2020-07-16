import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../Form/Checkbox';
import Panel from '../Site/Panel';

import { withTranslation } from 'react-i18next';

class GameConfiguration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    onOptionSettingToggle(option, event) {
        if (this.props.onOptionSettingToggle) {
            this.props.onOptionSettingToggle(option, event.target.checked);
        }
    }

    render() {
        let t = this.props.t;

        return (
            <div>
                <form className='form form-horizontal'>
                    <Panel title={t('Game Settings')}>
                        <div className='form-group'>
                            <Checkbox
                                name='optionSettings.orderForcedAbilities'
                                noGroup
                                label={t('Prompt to order simultaneous abilities')}
                                fieldClass='col-sm-12'
                                onChange={this.onOptionSettingToggle.bind(
                                    this,
                                    'orderForcedAbilities'
                                )}
                                checked={this.props.optionSettings.orderForcedAbilities}
                            />
                            <Checkbox
                                name='optionSettings.confirmOneClick'
                                noGroup
                                label={t('Show a prompt when initating 1-click abilities')}
                                fieldClass='col-sm-12'
                                onChange={this.onOptionSettingToggle.bind(this, 'confirmOneClick')}
                                checked={this.props.optionSettings.confirmOneClick}
                            />
                        </div>
                    </Panel>
                </form>
            </div>
        );
    }
}

GameConfiguration.displayName = 'GameConfiguration';
GameConfiguration.propTypes = {
    i18n: PropTypes.object,
    onOptionSettingToggle: PropTypes.func,
    optionSettings: PropTypes.object,
    t: PropTypes.func
};

export default withTranslation()(GameConfiguration);
