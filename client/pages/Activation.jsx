import React, { useEffect } from 'react';
import { toast } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AlertPanel from '../Components/Site/AlertPanel';
import ApiStatus from '../Components/Site/ApiStatus';
import { useActivateAccountMutation } from '../redux/api';

const Activation = ({ id, token }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activateAccount, activateState] = useActivateAccountMutation();

    useEffect(() => {
        if (activateState.isSuccess) {
            toast.success(t('Your account has been activated.'));
            activateState.reset();
            navigate('/login');
        }
    }, [activateState, navigate, t]);

    const apiState = activateState.isUninitialized
        ? null
        : {
              loading: activateState.isLoading,
              success: activateState.isSuccess,
              message: activateState.isSuccess
                  ? t('Your account has been activated.')
                  : activateState.error?.data?.message
          };

    useEffect(() => {
        if (id && token) {
            activateAccount({ id, token });
        }
    }, [activateAccount, id, token]);

    if (!id || !token) {
        return (
            <AlertPanel
                type='danger'
                message={t(
                    'This page is not intended to be viewed directly.  Please click on the link in your email to activate your account'
                )}
            />
        );
    }

    return (
        <div className='mx-auto w-full max-w-3xl'>
            <ApiStatus state={apiState} onClose={() => activateState.reset()} />
        </div>
    );
};

Activation.displayName = 'Activation';

export default Activation;
