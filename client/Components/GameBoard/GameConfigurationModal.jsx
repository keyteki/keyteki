import React from 'react';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import GameConfiguration from './GameConfiguration';
import './GameConfigurationModal.scss';

const GameConfigurationModal = ({ optionSettings, onClose, onOptionSettingToggle }) => {
    const { t } = useTranslation();

    return (
        <>
            <Modal show={true} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('Game Configuration')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <GameConfiguration
                        optionSettings={optionSettings}
                        onOptionSettingToggle={onOptionSettingToggle}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

GameConfigurationModal.displayName = 'GameConfigurationModal';

export default GameConfigurationModal;
