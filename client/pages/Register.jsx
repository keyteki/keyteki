import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';

import AlertPanel from '../Components/Site/AlertPanel.jsx';
import Panel from '../Components/Site/Panel.jsx';
import Form from '../Components/Form/Form.jsx';
import Link from '../Components/Navigation/Link.jsx';

import * as actions from '../redux/actions';

const Register = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [successMessage, setSuccessMessage] = useState('');

    const accountRegistered = useSelector((state) => state.account.registered);
    const apiLoading = useSelector((state) =>
        state.api.REGISTER_ACCOUNT ? state.api.REGISTER_ACCOUNT.loading : undefined
    );
    const apiMessage = useSelector((state) =>
        state.api.REGISTER_ACCOUNT ? state.api.REGISTER_ACCOUNT.message : undefined
    );
    const apiSuccess = useSelector((state) =>
        state.api.REGISTER_ACCOUNT ? state.api.REGISTER_ACCOUNT.success : undefined
    );

    useEffect(() => {
        if (accountRegistered) {
            setSuccessMessage(
                t('Your account was successfully registered.  You can now proceed to login.')
            );
            const timer = setTimeout(() => {
                dispatch(actions.navigate('/login'));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [accountRegistered, dispatch, t]);

    const onRegister = (state) => {
        dispatch(
            actions.registerAccount({
                username: state.username,
                password: state.password,
                email: state.email
            })
        );
    };

    const errorBar =
        apiSuccess === false ? <AlertPanel type='error' message={t(apiMessage)} /> : null;
    const successBar = successMessage ? (
        <AlertPanel type='success' message={t(successMessage)} />
    ) : null;

    return (
        <div className='col-md-8 col-md-offset-2'>
            {errorBar}
            {successBar}
            <Panel title={t('Register an account')}>
                <Trans i18nKey='register.disclosure'>
                    <p>
                        We require information from you in order to service your access to the site.
                        Please see the <Link href='/privacy'>privacy policy</Link> for details on
                        why we need this information and what we do with it. Please pay particular
                        attention to the section on avatars.
                    </p>
                </Trans>

                <Form
                    name='register'
                    apiLoading={apiLoading}
                    buttonText='Register'
                    onSubmit={onRegister}
                />
            </Panel>
        </div>
    );
};

Register.displayName = 'Register';

export default Register;
