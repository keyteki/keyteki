import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans } from 'react-i18next';
import AlertPanel from '../Components/Site/AlertPanel';
import { useNavigate } from 'react-router-dom';

import { useLogoutAccountMutation } from '../redux/api';
import {
    gameCloseRequested,
    lobbyConnectRequested,
    lobbyDisconnectRequested
} from '../redux/socketActions';

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loggedOut = useSelector((state) => state.account.loggedOut);
    const refreshToken = useSelector((state) => state.auth.refreshToken);
    const hasLobbySocket = useSelector((state) => !!state.lobby.socket);
    const hasGameSocket = useSelector((state) => !!state.games.socket);
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
            dispatch(lobbyConnectRequested());
            navigate('/');
        }
    }, [dispatch, loggedOut, navigate]);

    const errorBar = logoutState.isError ? (
        <AlertPanel
            type='error'
            message={logoutState.error?.data?.message || 'Unable to log out'}
        />
    ) : null;

    return (
        <div className='mx-auto w-full max-w-3xl'>
            {errorBar}
            <Trans>Logging you out of your account, please wait...</Trans>
        </div>
    );
};

Logout.displayName = 'Logout';

export default Logout;
