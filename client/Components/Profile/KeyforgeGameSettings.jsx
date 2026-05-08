import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label, Switch } from '@heroui/react';
import Panel from '../Site/Panel';

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

    const interactionOptions = [
        ['orderForcedAbilities', t('Prompt to order simultaneous abilities')],
        ['confirmOneClick', t('Show a prompt when initiating 1-click abilities')]
    ];
    const displayOptions = [
        ['useHalfSizedCards', t('Use half sized card images')],
        ['showAccolades', t('Show deck accolades')]
    ];

    const renderOption = ([id, text]) => (
        <div
            key={id}
            className='flex items-center justify-between gap-2 rounded bg-surface-secondary/70 px-2 py-1.5'
        >
            <Label className='text-sm'>{text}</Label>
            <Switch
                id={id}
                isSelected={formProps.values.gameOptions[id]}
                onChange={(isSelected) => formProps.setFieldValue(`gameOptions.${id}`, isSelected)}
            >
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
            </Switch>
        </div>
    );

    return (
        <div className='grid gap-3 lg:grid-cols-2'>
            <Panel type='default' compactHeader title={t('Interaction')}>
                <div className='grid gap-2'>
                    {interactionOptions.map((option) => renderOption(option))}
                </div>
            </Panel>
            <Panel type='default' compactHeader title={t('Display')}>
                <div className='grid gap-2'>
                    {displayOptions.map((option) => renderOption(option))}
                </div>
            </Panel>
        </div>
    );
};

export default KeyforgeGameSettings;
