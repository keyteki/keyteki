import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '@heroui/react';

import { accountActions } from '../redux/slices/accountSlice';
import { useLinkPatreonMutation } from '../redux/api';
import AlertPanel from '../Components/Site/AlertPanel';
import ApiStatus from '../Components/Site/ApiStatus';
import { useNavigate } from 'react-router-dom';
import { PatreonStateKey } from '../constants';

/**
 * Only complete a link that this browser started, otherwise someone could link their Patreon
 * account to ours by getting us to open a callback url containing their code
 * @param {string} state
 * @returns {boolean}
 */
const isExpectedState = (state) => {
    try {
        const expected = window.sessionStorage.getItem(PatreonStateKey);

        return !!expected && expected === state;
    } catch {
        return false;
    }
};

const Patreon = ({ code, state }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [linkPatreon, linkState] = useLinkPatreonMutation();
    const accountLinked = useSelector((state) => state.account.accountLinked);

    const isValidState = !!code && isExpectedState(state);

    useEffect(() => {
        if (code && isValidState) {
            linkPatreon(code);
        }
    }, [code, isValidState, linkPatreon]);

    useEffect(() => {
        if (!accountLinked) {
            return;
        }

        toast.success('Your account was linked successfully.');
        try {
            window.sessionStorage.removeItem(PatreonStateKey);
        } catch {
            // Nothing to clear if storage is unavailable
        }
        dispatch(accountActions.clearLinkStatus());
        navigate('/profile');
    }, [accountLinked, dispatch, navigate]);

    if (!code) {
        return (
            <AlertPanel
                type='error'
                message='This page is not intended to be viewed directly.  Please click on one of the links at the top of the page or your browser back button to return to the site.'
            />
        );
    }

    if (!isValidState) {
        return (
            <AlertPanel
                type='error'
                message='This Patreon link request was not started from your profile.  Please try linking your account again from your profile page.'
            />
        );
    }

    const apiState = linkState.isUninitialized
        ? null
        : {
              loading: linkState.isLoading,
              success: linkState.isSuccess,
              message: linkState.isSuccess
                  ? 'Your account was linked successfully.'
                  : linkState.error?.data?.message
          };

    return (
        <div>
            <ApiStatus state={apiState} />
            {linkState.isLoading && <div>Please wait while we verify your details..</div>}
        </div>
    );
};

Patreon.propTypes = {
    code: PropTypes.string,
    state: PropTypes.string
};
Patreon.displayName = 'Patreon';

export default Patreon;
