import React, { useEffect, useState } from 'react';

import AlertPanel from '../Components/Site/AlertPanel.jsx';
import Panel from '../Components/Site/Panel.jsx';
import Form from '../Components/Form/Form.jsx';
import Link from '../Components/Navigation/Link.jsx';
import { useRegisterAccountMutation } from '../redux/api';

import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [successMessage, setSuccessMessage] = useState('');
    const [registerAccount, registerState] = useRegisterAccountMutation();
    const accountRegistered = registerState.isSuccess;

    useEffect(() => {
        if (!accountRegistered) {
            return;
        }

        setSuccessMessage(
            t('Your account was successfully registered.  You can now proceed to login.')
        );

        const timeoutId = setTimeout(() => {
            navigate('/login');
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [accountRegistered, navigate, t]);

    const errorBar = registerState.isError ? (
        <AlertPanel
            type='error'
            message={t(registerState.error?.data?.message || 'Registration failed')}
        />
    ) : null;
    const successBar = successMessage ? (
        <AlertPanel type='success' message={successMessage} />
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
                    apiLoading={registerState.isLoading}
                    buttonText='Register'
                    onSubmit={(state) =>
                        registerAccount({
                            username: state.username,
                            password: state.password,
                            email: state.email
                        })
                    }
                />
            </Panel>
        </div>
    );
};

Register.displayName = 'Register';

export default Register;
