import React from 'react';
import Panel from '../Site/Panel';
import { Switch } from '@heroui/react';
import { useTranslation } from 'react-i18next';

/**
 * @typedef { import('./Profile').ProfileDetails } ProfileDetails
 */

/**
 * @typedef KeyforgeGameSettingsProps
 * @property {import('formik').FormikProps<ProfileDetails>} formProps
 * @property {User} user
 */

/**
 * @param {KeyforgeGameSettingsProps} props
 */
const KeyforgeGameSettings = ({ formProps }) => {
    const { t } = useTranslation();

    return (
        <Panel title={t('Game Settings')}>
            <div className='flex flex-col gap-2'>
                <Switch
                    id='orderForcedAbilities'
                    name='gameOptions.orderForcedAbilities'
                    isSelected={formProps.values.gameOptions.orderForcedAbilities}
                    onValueChange={(checked) =>
                        formProps.setFieldValue('gameOptions.orderForcedAbilities', checked)
                    }
                    onBlur={formProps.handleBlur}
                >
                    {t('Prompt to order simultaneous abilities')}
                </Switch>
                <Switch
                    id='confirmOneClick'
                    name='gameOptions.confirmOneClick'
                    isSelected={formProps.values.gameOptions.confirmOneClick}
                    onValueChange={(checked) =>
                        formProps.setFieldValue('gameOptions.confirmOneClick', checked)
                    }
                    onBlur={formProps.handleBlur}
                >
                    {t('Show a prompt when initiating 1-click abilities')}
                </Switch>
                <Switch
                    id='useHalfSizedCards'
                    name='gameOptions.useHalfSizedCards'
                    isSelected={formProps.values.gameOptions.useHalfSizedCards}
                    onValueChange={(checked) =>
                        formProps.setFieldValue('gameOptions.useHalfSizedCards', checked)
                    }
                    onBlur={formProps.handleBlur}
                >
                    {t('Use half sized card images')}
                </Switch>
            </div>
        </Panel>
    );
};

export default KeyforgeGameSettings;
