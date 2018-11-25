import { connectLobby, authenticateSocket } from './socket';

export function registerAccount(user) {
    return {
        types: ['REGISTER_ACCOUNT', 'ACCOUNT_REGISTERED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/account/register',
            type: 'POST',
            data: JSON.stringify({ username: user.username, password: user.password, email: user.email, enableGravatar: user.enableGravatar }),
            contentType: 'application/json'
        }
    };
}

export function loginAccount(auth) {
    return {
        types: ['LOGIN_ACCOUNT', 'ACCOUNT_LOGGEDIN'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/account/login',
            type: 'POST',
            data: JSON.stringify({ username: auth.username, password: auth.password }),
            contentType: 'application/json',
            skipAuth: true
        }
    };
}

export function logoutAccount(tokenId) {
    return {
        types: ['LOGOUT_ACCOUNT', 'ACCOUNT_LOGGEDOUT'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/account/logout',
            type: 'POST',
            data: JSON.stringify({ tokenId: tokenId }),
            contentType: 'application/json'
        }
    };
}

export function logout() {
    return (dispatch, getState) => {
        let state = getState();

        if(!state.auth.refreshToken) {
            return;
        }

        if(state.lobby.socket) {
            state.lobby.socket.closing = true;
            state.lobby.socket.disconnect();

            dispatch(connectLobby());
        }

        if(state.games.socket) {
            state.games.socket.disconnect();
        }

        return dispatch(logoutAccount(state.auth.refreshToken.id));
    };
}

export function forgotPassword(details) {
    return {
        types: ['FORGOTPASSWORD_ACCOUNT', 'ACCOUNT_FORGOTPASSWORD'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/account/password-reset',
            type: 'POST',
            data: JSON.stringify({ username: details.username, captcha: details.captcha }),
            contentType: 'application/json'
        }
    };
}

export function resetPassword(details) {
    return {
        types: ['RESETPASSWORD_ACCOUNT', 'ACCOUNT_PASSWORDRESET'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/account/password-reset-finish',
            type: 'POST',
            data: JSON.stringify({ id: details.id, token: details.token, newPassword: details.newPassword }),
            contentType: 'application/json'
        }
    };
}

export function activateAccount(details) {
    return {
        types: ['ACTIVATE_ACCOUNT', 'ACCOUNT_ACTIVATED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/account/activate',
            type: 'POST',
            data: JSON.stringify({ id: details.id, token: details.token }),
            contentType: 'application/json'
        }
    };
}

export function setAuthTokens(token, refreshToken) {
    return {
        type: 'SET_AUTH_TOKENS',
        token: token,
        refreshToken: refreshToken
    };
}

export function verifyAuthentication() {
    return {
        types: ['ACCOUNT_VERIFY_AUTH', 'ACCOUNT_AUTH_VERIFIED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/account/checkauth',
            type: 'POST'
        }
    };
}

export function authenticate() {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(verifyAuthentication(state.auth.token));

        return dispatch(authenticateSocket());
    };
}

export function updateAvatar(user) {
    return {
        types: ['ACCOUNT_UPDATE_AVATAR', 'ACCOUNT_AVATAR_UPDATE'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/account/${user}/updateavatar`,
            type: 'POST'
        }
    };
}
