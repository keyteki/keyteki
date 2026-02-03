import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { clearLinkStatus, linkPatreon } from '../redux/actions';
import AlertPanel from '../Components/Site/AlertPanel';
import ApiStatus from '../Components/Site/ApiStatus';
import { useNavigate } from 'react-router-dom';

const Patreon = ({ code }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const { accountLinked, apiState } = useSelector((state) => ({
        accountLinked: state.account.accountLinked,
        apiState: state.api.ACCOUNT_LINK_REQUEST || {}
    }));

    useEffect(() => {
        if (code) {
            dispatch(linkPatreon(code));
        }
    }, [code, dispatch]);

    useEffect(() => {
        if (!accountLinked) {
            return;
        }

        setSuccessMessage(
            'Your account was linked successfully.  Sending you back to the profile page.'
        );

        const timeoutId = setTimeout(() => {
            dispatch(clearLinkStatus());
            navigate('/profile');
        }, 5000);

        return () => clearTimeout(timeoutId);
    }, [accountLinked, dispatch, navigate]);

    if (!code) {
        return (
            <AlertPanel
                type='error'
                message='This page is not intended to be viewed directly.  Please click on one of the links at the top of the page or your browser back button to return to the site.'
            />
        );
    }

    return (
        <div>
            <ApiStatus apiState={apiState} successMessage={successMessage} />
            {apiState.loading && <div>Please wait while we verify your details..</div>}
        </div>
    );
};

Patreon.propTypes = {
    code: PropTypes.string.isRequired
};
Patreon.displayName = 'Patreon';

export default Patreon;
