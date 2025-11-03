import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import AlertPanel from '../Components/Site/AlertPanel';
import { navigate } from '../redux/slices/navigationSlice';
import { useActivateAccountMutation } from '../redux/slices/apiSlice';

const Activation = ({ id, token }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [activateAccount, { isSuccess, reset }] = useActivateAccountMutation();

    useEffect(() => {
        if (id && token) {
            activateAccount({ id, token });
        }
    }, [id, token, activateAccount]);

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                dispatch(navigate('/login'));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, dispatch]);

    if (!id || !token) {
        return (
            <AlertPanel
                type='danger'
                title=''
                message={t(
                    'This page is not intended to be viewed directly.  Please click on the link in your email to activate your account'
                )}
            >
                {null}
            </AlertPanel>
        );
    }

    return (
        <div className='max-w-3xl mx-auto px-4'>
            {isSuccess && (
                <AlertPanel
                    type='success'
                    title=''
                    message={t(
                        'Your account has been activated.  You will shortly be redirected to the login page.'
                    )}
                    onClose={reset}
                >
                    {null}
                </AlertPanel>
            )}
        </div>
    );
};

Activation.displayName = 'Activation';

export default Activation;
