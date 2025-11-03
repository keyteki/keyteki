import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans } from 'react-i18next';
import AlertPanel from '../Components/Site/AlertPanel';

import { navigate } from '../redux/slices/navigationSlice';
import { useLogoutMutation } from '../redux/slices/apiSlice';

const Logout = () => {
    const dispatch = useDispatch();
    const loggedOut = useSelector((state) => state.account.loggedOut);
    const [logoutAccount, { error }] = useLogoutMutation();

    useEffect(() => {
        logoutAccount();
    }, [logoutAccount]);

    useEffect(() => {
        if (loggedOut) {
            dispatch(navigate('/'));
        }
    }, [loggedOut, dispatch]);

    return (
        <div className='col-sm-6 col-sm-offset-3'>
            {error && (
                <AlertPanel type='error' title='' message={error.message || 'Logout failed'}>
                    {null}
                </AlertPanel>
            )}
            <Trans>Logging you out of your account, please wait...</Trans>
        </div>
    );
};

Logout.displayName = 'Logout';

Logout.propTypes = {};

export default Logout;
