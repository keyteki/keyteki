// @ts-nocheck
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { navigate } from '../redux/slices/navigationSlice';
import { useLinkPatreonMutation } from '../redux/slices/apiSlice';
import AlertPanel from '../Components/Site/AlertPanel';

const Patreon = ({ code }) => {
    const dispatch = useDispatch();
    const [linkPatreon, { isLoading, isSuccess, reset }] = useLinkPatreonMutation();
    const accountLinked = useSelector((state) => state.account.accountLinked);

    useEffect(() => {
        if (code) {
            linkPatreon({ code });
        }
    }, [code, linkPatreon]);

    useEffect(() => {
        if (accountLinked || isSuccess) {
            const timer = setTimeout(() => {
                dispatch(navigate('/profile'));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [accountLinked, isSuccess, dispatch]);

    if (!code) {
        return (
            <AlertPanel
                type='error'
                title=''
                message='This page is not intended to be viewed directly.  Please click on one of the links at the top of the page or your browser back button to return to the site.'
            >
                {null}
            </AlertPanel>
        );
    }

    return (
        <div>
            {(accountLinked || isSuccess) && (
                <AlertPanel
                    type='success'
                    title=''
                    message='Your account was linked successfully.  Sending you back to the profile page.'
                    onClose={reset}
                >
                    {null}
                </AlertPanel>
            )}
            {isLoading && <div>Please wait while we verify your details..</div>}
        </div>
    );
};

Patreon.propTypes = {
    code: PropTypes.string.isRequired
};
Patreon.displayName = 'Patreon';

export default Patreon;
