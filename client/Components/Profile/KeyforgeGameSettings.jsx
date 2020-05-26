import React from 'react';
import Panel from '../Site/Panel';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/**
 * @typedef { import('./Profile').ProfileDetails } ProfileDetails
 */

/**
 * @typedef KeyforgeGameSettingsProps
 * @property {import('formik').FormikProps<ProfileDetails} formProps
 * @property {User} user
 */

/**
 * @param {KeyforgeGameSettingsProps} props
 * @returns {React.FC<KeyforgeGameSettingsProps>}
 */
const KeyforgeGameSettings = (props) => {
    const { t } = useTranslation();
    const formProps = props.formProps;

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
                <Form.Check
                    id='confirmOneClick'
                    name='gameOptions.confirmOneClick'
                    label={t('Show a prompt when initating 1-click abilities')}
                    type='switch'
                    checked={formProps.values.gameOptions.confirmOneClick}
                    onChange={formProps.handleChange}
                    onBlur={formProps.handleBlur}
                />
            </Form.Row>
        </Panel>
    );
};

export default KeyforgeGameSettings;
