import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@heroui/react';

import Panel from '../Site/Panel';

const GameConfiguration = ({ optionSettings, onOptionSettingToggle }) => {
    const { t } = useTranslation();

    return (
        <div>
            <Panel title={t('Game Settings')}>
                <div className='flex flex-col gap-2'>
                    <Switch
                        id='orderForcedAbilities'
                        name='optionSettings.orderForcedAbilities'
                        isSelected={optionSettings.orderForcedAbilities}
                        onValueChange={(checked) =>
                            onOptionSettingToggle('orderForcedAbilities', checked)
                        }
                    >
                        {t('Prompt to order simultaneous abilities')}
                    </Switch>
                    <Switch
                        id='confirmOneClick'
                        name='gameOptions.confirmOneClick'
                        isSelected={optionSettings.confirmOneClick}
                        onValueChange={(checked) =>
                            onOptionSettingToggle('confirmOneClick', checked)
                        }
                    >
                        {t('Show a prompt when initiating 1-click abilities')}
                    </Switch>
                    <Switch
                        id='useHalfSizedCards'
                        name='gameOptions.useHalfSizedCards'
                        isSelected={optionSettings.useHalfSizedCards}
                        onValueChange={(checked) =>
                            onOptionSettingToggle('useHalfSizedCards', checked)
                        }
                    >
                        {t('Use half sized card images')}
                    </Switch>
                </div>
            </Panel>
        </div>
    );
};

GameConfiguration.displayName = 'GameConfiguration';

export default GameConfiguration;
