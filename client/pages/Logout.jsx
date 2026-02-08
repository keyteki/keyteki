import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans } from 'react-i18next';
import AlertPanel from '../Components/Site/AlertPanel';
import { useNavigate } from 'react-router-dom';

import { useLogoutAccountMutation } from '../redux/api';
import { gameCloseRequested, lobbyDisconnectRequested } from '../redux/socketActions';

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loggedOut, refreshToken, hasLobbySocket, hasGameSocket } = useSelector((state) => ({
        loggedOut: state.account.loggedOut,
        refreshToken: state.auth.refreshToken,
        hasLobbySocket: !!state.lobby.socket,
        hasGameSocket: !!state.games.socket
    }));
    const [logoutAccount, logoutState] = useLogoutAccountMutation();

    useEffect(() => {
        if (!refreshToken) {
            navigate('/');
            return;
        }

        if (hasLobbySocket) {
            dispatch(lobbyDisconnectRequested());
        }

        if (hasGameSocket) {
            dispatch(gameCloseRequested());
        }

        logoutAccount({ tokenId: refreshToken.id });
    }, [dispatch, hasGameSocket, hasLobbySocket, logoutAccount, navigate, refreshToken]);

    useEffect(() => {
        if (loggedOut) {
            navigate('/');
        }
    }, [loggedOut, navigate]);

    const errorBar = logoutState.isError ? (
        <AlertPanel
            type='error'
            message={logoutState.error?.data?.message || 'Unable to log out'}
        />
    ) : null;

    return (
        <div className='col-sm-6 col-sm-offset-3'>
            {errorBar}
            <Trans>Logging you out of your account, please wait...</Trans>
        </div>
    );
};

Logout.displayName = 'Logout';

export default Logout;
