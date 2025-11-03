import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Login from '../Components/Login';
import Panel from '../Components/Site/Panel';
import AlertPanel from '../Components/Site/AlertPanel';
import { useLoginMutation } from '../redux/slices/apiSlice';
import { authenticateSocket } from '../redux/actions/socket';
import { navigate } from '../redux/slices/navigationSlice';

const LoginContainer = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [loginAccount, { isSuccess, error, reset }] = useLoginMutation();

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                dispatch(authenticateSocket());
                dispatch(navigate('/'));
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, dispatch]);

    return (
        <div className='max-w-4xl mx-auto px-4'>
            <Panel title={t('Login')}>
                {error && error.status === 401 && (
                    <AlertPanel
                        type='danger'
                        title=''
                        message={t('Invalid username/password')}
                        onClose={reset}
                    >
                        {null}
                    </AlertPanel>
                )}
                {isSuccess && (
                    <AlertPanel
                        type='success'
                        title=''
                        message={t('Login successful, redirecting you to the home page')}
                        onClose={reset}
                    >
                        {null}
                    </AlertPanel>
                )}
                <Login
                    onSubmit={async (values) => {
                        try {
                            await loginAccount(values).unwrap();
                        } catch (err) {
                            // Error handled by AlertPanel
                        }
                    }}
                />
            </Panel>
        </div>
    );
};

export default LoginContainer;
