import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans } from 'react-i18next';
import AlertPanel from '../Components/Site/AlertPanel';

import { logout, navigate } from '../redux/actions';

const Logout = () => {
    const dispatch = useDispatch();
    const { apiMessage, apiSuccess, loggedOut } = useSelector((state) => ({
        apiMessage: state.api.LOGOUT_ACCOUNT ? state.api.LOGOUT_ACCOUNT.message : undefined,
        apiSuccess: state.api.LOGOUT_ACCOUNT ? state.api.LOGOUT_ACCOUNT.success : undefined,
        loggedOut: state.account.loggedOut
    }));

    useEffect(() => {
        dispatch(logout());
    }, [dispatch]);

    useEffect(() => {
        if (loggedOut) {
            dispatch(navigate('/'));
        }
    }, [loggedOut, dispatch]);

    const errorBar = apiSuccess === false ? <AlertPanel type='error' message={apiMessage} /> : null;

    return (
        <div className='col-sm-6 col-sm-offset-3'>
            {errorBar}
            <Trans>Logging you out of your account, please wait...</Trans>
        </div>
    );
};

Logout.displayName = 'Logout';

Logout.propTypes = {};

export default Logout;
