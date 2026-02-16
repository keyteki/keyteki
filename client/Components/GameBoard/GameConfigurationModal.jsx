import React from 'react';
import { Modal as HeroModal } from '@heroui/react';
import { useTranslation } from 'react-i18next';

import GameConfiguration from './GameConfiguration';

const GameConfigurationModal = ({ optionSettings, onClose, onOptionSettingToggle }) => {
    const { t } = useTranslation();

    return (
        <HeroModal.Backdrop isOpen onOpenChange={onClose}>
            <HeroModal.Container placement='center'>
                <HeroModal.Dialog className='sm:max-w-2xl'>
                    <HeroModal.CloseTrigger />
                    <HeroModal.Header>
                        <HeroModal.Heading>{t('Game Configuration')}</HeroModal.Heading>
                    </HeroModal.Header>
                    <HeroModal.Body>
                        <GameConfiguration
                            optionSettings={optionSettings}
                            onOptionSettingToggle={onOptionSettingToggle}
                        />
                    </HeroModal.Body>
                </HeroModal.Dialog>
            </HeroModal.Container>
        </HeroModal.Backdrop>
    );
};

GameConfigurationModal.displayName = 'GameConfigurationModal';

export default GameConfigurationModal;
