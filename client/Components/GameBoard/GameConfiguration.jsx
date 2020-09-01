import React from 'react';
import { useTranslation } from 'react-i18next';

import Panel from '../Site/Panel';
import { Form } from 'react-bootstrap';

const GameConfiguration = ({ optionSettings, onOptionSettingToggle }) => {
    const { t } = useTranslation();

    return (
        <div>
            <Form>
                <Panel title={t('Game Settings')}>
                    <Form.Row>
                        <Form.Check
                            id='orderForcedAbilities'
                            name='optionSettings.orderForcedAbilities'
                            label={t('Prompt to order simultaneous abilities')}
                            type='switch'
                            checked={optionSettings.orderForcedAbilities}
                            onChange={(event) =>
                                onOptionSettingToggle('orderForcedAbilities', event.target.checked)
                            }
                        />
                        <Form.Check
                            id='confirmOneClick'
                            name='gameOptions.confirmOneClick'
                            label={t('Show a prompt when initating 1-click abilities')}
                            type='switch'
                            checked={optionSettings.confirmOneClick}
                            onChange={(event) =>
                                onOptionSettingToggle('confirmOneClick', event.target.checked)
                            }
                        />
                    </Form.Row>
                </Panel>
            </Form>
        </div>
    );
};

GameConfiguration.displayName = 'GameConfiguration';

export default GameConfiguration;
