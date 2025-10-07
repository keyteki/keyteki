import React from 'react';
import { useTranslation } from 'react-i18next';

import Panel from '../Site/Panel';
import { Form, Row } from 'react-bootstrap';

const GameConfiguration = ({ optionSettings, onOptionSettingToggle }) => {
    const { t } = useTranslation();

    return (
        <div>
            <Form>
                <Panel title={t('Game Settings')}>
                    <Row>
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
                            label={t('Show a prompt when initiating 1-click abilities')}
                            type='switch'
                            checked={optionSettings.confirmOneClick}
                            onChange={(event) =>
                                onOptionSettingToggle('confirmOneClick', event.target.checked)
                            }
                        />
                        <Form.Check
                            id='useHalfSizedCards'
                            name='gameOptions.useHalfSizedCards'
                            label={t('Use half sized card images')}
                            type='switch'
                            checked={optionSettings.useHalfSizedCards}
                            onChange={(event) =>
                                onOptionSettingToggle('useHalfSizedCards', event.target.checked)
                            }
                        />
                    </Row>
                </Panel>
            </Form>
        </div>
    );
};

GameConfiguration.displayName = 'GameConfiguration';

export default GameConfiguration;
