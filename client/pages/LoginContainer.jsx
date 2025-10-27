import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Login from '../Components/Login';
import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import { Auth } from '../redux/types';
import { loginAccount, clearApiStatus, authenticateSocket, navigate } from '../redux/actions';

const LoginContainer = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const apiState = useSelector((state) => {
        const retState = state.api[Auth.LoginAccount];

        if (retState && retState.status === 401) {
            retState.message = t('Invalid username/password');
        } else if (retState && retState.success) {
            retState.message = t('Login successful, redirecting you to the home page');

            setTimeout(() => {
                dispatch(clearApiStatus(Auth.LoginAccount));
                dispatch(authenticateSocket());
                dispatch(navigate('/'));
            }, 500);
        }

        return retState;
    });

    return (
        <div className='max-w-4xl mx-auto px-4'>
            <Panel title={t('Login')}>
                <ApiStatus
                    state={apiState}
                    onClose={() => dispatch(clearApiStatus(Auth.LoginAccount))}
                />
                <Login onSubmit={(values) => dispatch(loginAccount(values))} />
            </Panel>
        </div>
    );
};

export default LoginContainer;
