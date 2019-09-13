import React from 'react';
import PropTypes from 'prop-types';

import GameConfiguration from './GameConfiguration';
import Modal from '../Site/Modal';

import { withTranslation } from 'react-i18next';

export class GameConfigurationModal extends React.Component {
    render() {
        return (
            <Modal id={ this.props.id } className='settings-popup row' bodyClassName='col-xs-12' title={ this.props.t('Game Configuration') }>
                <GameConfiguration
                    optionSettings={ this.props.optionSettings }
                    onOptionSettingToggle={ this.props.onOptionSettingToggle } />
            </Modal>);
    }
}

GameConfigurationModal.displayName = 'GameConfigurationModal';
GameConfigurationModal.propTypes = {
    i18n: PropTypes.object,
    id: PropTypes.string,
    onOptionSettingToggle: PropTypes.func,
    optionSettings: PropTypes.object,
    t: PropTypes.func
};

export default withTranslation()(GameConfigurationModal);
