import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from '@heroui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Login from '../Components/Login';
import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import { useLoginAccountMutation } from '../redux/api';
import { lobbyAuthenticateRequested, lobbyConnectRequested } from '../redux/socketActions';

const LoginContainer = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    // Only return to a page on this site, so a crafted link can't send people elsewhere after logging in
    const returnTo = searchParams.get('return');
    const returnPath = /^\/(?![/\\])/.test(returnTo || '') ? returnTo : '/';
    const [loginAccount, loginState] = useLoginAccountMutation();
    const { isSuccess, reset } = loginState;

    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(t('Login successful'));
            reset();
            dispatch(lobbyConnectRequested());
            dispatch(lobbyAuthenticateRequested());
            navigate(returnPath);
        }
    }, [dispatch, isSuccess, navigate, reset, returnPath, t]);

    const apiState = loginState.isUninitialized
        ? null
        : {
              loading: loginState.isLoading,
              success: isSuccess,
              message: isSuccess
                  ? t('Login successful')
                  : loginState.error?.status === 401
                  ? t('Invalid username/password')
                  : loginState.error?.data?.message
          };

    return (
        <div className='mx-auto w-full max-w-2xl'>
            <Panel title={t('Login')}>
                <ApiStatus state={apiState} onClose={() => loginState.reset()} />
                <Login onSubmit={(values) => loginAccount(values)} />
            </Panel>
        </div>
    );
};

export default LoginContainer;
