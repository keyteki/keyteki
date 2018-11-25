import React from 'react';
import PropTypes from 'prop-types';

import GameConfiguration from './GameConfiguration';
import Modal from '../Site/Modal';

export class GameConfigurationModal extends React.Component {
    render() {
        return (
            <Modal id={ this.props.id } className='settings-popup row' bodyClassName='col-xs-12' title='Game Configuration'>
                <GameConfiguration
                    actionWindows={ this.props.promptedActionWindows }
                    keywordSettings={ this.props.keywordSettings }
                    promptDupes={ this.props.promptDupes }
                    timerSettings={ this.props.timerSettings }
                    onKeywordSettingToggle={ this.props.onKeywordSettingToggle }
                    onTimerSettingToggle={ this.props.onTimerSettingToggle }
                    onActionWindowToggle={ this.props.onPromptedActionWindowToggle }
                    onPromptDupesToggle={ this.props.onPromptDupesToggle }
                />
            </Modal>);
    }
}

GameConfigurationModal.displayName = 'GameConfigurationModal';
GameConfigurationModal.propTypes = {
    id: PropTypes.string,
    keywordSettings: PropTypes.object,
    onKeywordSettingToggle: PropTypes.func,
    onPromptDupesToggle: PropTypes.func,
    onPromptedActionWindowToggle: PropTypes.func,
    onTimerSettingToggle: PropTypes.func,
    promptDupes: PropTypes.bool,
    promptedActionWindows: PropTypes.object,
    timerSettings: PropTypes.object
};

export default GameConfigurationModal;
