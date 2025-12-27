import React from 'react';
import Panel from '../Site/Panel';
import { Form } from 'react-bootstrap';
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
            <Form.Row>
                <Form.Check
                    id='orderForcedAbilities'
                    name='gameOptions.orderForcedAbilities'
                    label={t('Prompt to order simultaneous abilities')}
                    type='switch'
                    checked={formProps.values.gameOptions.orderForcedAbilities}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                />
            </Form.Row>
            <Form.Row>
                <Form.Check
                    id='confirmOneClick'
                    name='gameOptions.confirmOneClick'
                    label={t('Show a prompt when initiating 1-click abilities')}
                    type='switch'
                    checked={formProps.values.gameOptions.confirmOneClick}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                />
            </Form.Row>
            <Form.Row>
                <Form.Check
                    id='useHalfSizedCards'
                    name='gameOptions.useHalfSizedCards'
                    label={t('Use half sized card images')}
                    type='switch'
                    checked={formProps.values.gameOptions.useHalfSizedCards}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                />
            </Form.Row>
            <Form.Row>
                <Form.Check
                    id='showAccolades'
                    name='gameOptions.showAccolades'
                    label={t('Show deck accolades')}
                    type='switch'
                    checked={formProps.values.gameOptions.showAccolades}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                />
            </Form.Row>
        </Panel>
    );
};

export default KeyforgeGameSettings;
