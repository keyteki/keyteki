import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';

import GameConfiguration from './GameConfiguration';
import './GameConfigurationModal.scss';

const GameConfigurationModal = ({ optionSettings, onClose, onOptionSettingToggle }) => {
    const { t } = useTranslation();

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalContent>
                <ModalHeader>{t('Game Configuration')}</ModalHeader>
                <ModalBody>
                    <GameConfiguration
                        optionSettings={optionSettings}
                        onOptionSettingToggle={onOptionSettingToggle}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

GameConfigurationModal.displayName = 'GameConfigurationModal';

export default GameConfigurationModal;
