import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '@heroui/react';

import { accountActions } from '../redux/slices/accountSlice';
import { useLinkPatreonMutation } from '../redux/api';
import AlertPanel from '../Components/Site/AlertPanel';
import ApiStatus from '../Components/Site/ApiStatus';
import { useNavigate } from 'react-router-dom';

const Patreon = ({ code }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [linkPatreon, linkState] = useLinkPatreonMutation();
    const accountLinked = useSelector((state) => state.account.accountLinked);

    useEffect(() => {
        if (code) {
            linkPatreon(code);
        }
    }, [code, linkPatreon]);

    useEffect(() => {
        if (!accountLinked) {
            return;
        }

        toast.success('Your account was linked successfully.');
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
    code: PropTypes.string
};
Patreon.displayName = 'Patreon';

export default Patreon;
