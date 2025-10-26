// @ts-nocheck
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import AlertPanel from '../Components/Site/AlertPanel';
import ApiStatus from '../Components/Site/ApiStatus';

/**
 * @typedef PatreonProps
 * @property {string} code
 * @property {boolean} [accountLinked]
 * @property {(code: string) => void} linkPatreon
 * @property {() => void} clearLinkStatus
 * @property {(path: string) => void} navigate
 * @property {{ loading?: boolean, success?: boolean, message?: any }} apiState
 */

/**
 * @param {PatreonProps} props
 */
const Patreon = ({ code, linkPatreon, accountLinked, clearLinkStatus, navigate, apiState }) => {
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (code) {
            linkPatreon(code);
        }
        // run once on mount when code is present
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    useEffect(() => {
        if (accountLinked) {
            setSuccessMessage(
                'Your account was linked successfully.  Sending you back to the profile page.'
            );
            const id = setTimeout(() => {
                clearLinkStatus();
                navigate('/profile');
            }, 5000);
            return () => clearTimeout(id);
        }
    }, [accountLinked, clearLinkStatus, navigate]);

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
            <ApiStatus state={apiState} onClose={() => clearLinkStatus()} />
            {!!successMessage && <AlertPanel type='success' message={successMessage} />}
            {apiState.loading && <div>Please wait while we verify your details..</div>}
        </div>
    );
};

Patreon.propTypes = {
    accountLinked: PropTypes.bool,
    apiState: PropTypes.object,
    clearLinkStatus: PropTypes.func,
    code: PropTypes.string.isRequired,
    linkPatreon: PropTypes.func,
    navigate: PropTypes.func
};
Patreon.displayName = 'Patreon';

/**
 * @param {any} state
 */
function mapStateToProps(state) {
    return {
        accountLinked: state.account.accountLinked,
        apiState: state.api.ACCOUNT_LINK_REQUEST || {}
    };
}

export default connect(mapStateToProps, actions)(Patreon);
