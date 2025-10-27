import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import AlertPanel from '../Components/Site/AlertPanel';
import ApiStatus from '../Components/Site/ApiStatus';
import { activateAccount, clearApiStatus, navigate } from '../redux/actions';
import { Account } from '../redux/types';

const Activation = ({ id, token }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const apiState = useSelector((state) => {
        const retState = state.api[Account.ActivateAccount];

        if (retState && retState.success) {
            retState.message = t(
                'Your account has been activated.  You will shortly be redirected to the login page.'
            );

            setTimeout(() => {
                dispatch(clearApiStatus(Account.ActivateAccount));
                dispatch(navigate('/login'));
            }, 3000);
        }

        return retState;
    });
    useEffect(() => {
        dispatch(activateAccount({ id: id, token: token }));
    }, [dispatch, id, token]);

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
        <div className='max-w-3xl mx-auto px-4'>
            <ApiStatus
                state={apiState}
                onClose={() => dispatch(clearApiStatus(Account.ActivateAccount))}
            />
        </div>
    );
};

Activation.displayName = 'Activation';

export default Activation;
