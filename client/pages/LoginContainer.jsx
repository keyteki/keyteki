import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Col } from 'react-bootstrap';

import Login from '../Components/Login';
import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import { useLoginAccountMutation } from '../redux/api';
import { lobbyAuthenticateRequested } from '../redux/socketActions';

const LoginContainer = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loginAccount, loginState] = useLoginAccountMutation();

    useEffect(() => {
        if (loginState.isSuccess) {
            const timeoutId = setTimeout(() => {
                loginState.reset();
                dispatch(lobbyAuthenticateRequested());
                navigate('/');
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [dispatch, loginState, navigate]);

    const apiState = loginState.isUninitialized
        ? null
        : {
              loading: loginState.isLoading,
              success: loginState.isSuccess,
              message: loginState.isSuccess
                  ? t('Login successful, redirecting you to the home page')
                  : loginState.error?.status === 401
                  ? t('Invalid username/password')
                  : loginState.error?.data?.message
          };

    return (
        <Col lg={{ span: 8, offset: 2 }}>
            <Panel title={t('Login')}>
                <ApiStatus state={apiState} onClose={() => loginState.reset()} />
                <Login onSubmit={(values) => loginAccount(values)} />
            </Panel>
        </Col>
    );
};

export default LoginContainer;
