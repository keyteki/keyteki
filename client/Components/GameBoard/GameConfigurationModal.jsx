import React from 'react';
import PropTypes from 'prop-types';

import GameConfiguration from './GameConfiguration';
import Modal from '../Site/Modal';

export class GameConfigurationModal extends React.Component {
    render() {
        return (
            <Modal id={ this.props.id } className='settings-popup row' bodyClassName='col-xs-12' title='Game Configuration'>
                <GameConfiguration
                    optionSettings={ this.props.optionSettings }
                    onOptionSettingToggle={ this.props.onOptionSettingToggle } />
            </Modal>);
    }
}

GameConfigurationModal.displayName = 'GameConfigurationModal';
GameConfigurationModal.propTypes = {
    id: PropTypes.string,
    onOptionSettingToggle: PropTypes.func,
    optionSettings: PropTypes.object
};

export default GameConfigurationModal;
