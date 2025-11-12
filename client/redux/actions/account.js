// @ts-nocheck
import { connectLobby, sendAuthenticate } from '../slices/lobbySlice';
import { api } from '../slices/apiSlice';

// Re-export RTK Query hooks
export const {
    useLoginMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useActivateAccountMutation,
    useVerifyAuthMutation,
    useLinkPatreonMutation,
    useUnlinkPatreonMutation
} = api;

// Re-export auth and account actions from slices
export { setAuthTokens, accountLoggedIn, accountLoggedOut } from '../slices/authSlice';

export function loginAccount(auth) {
    return (dispatch) => {
        return dispatch(
            api.endpoints.login.initiate({ username: auth.username, password: auth.password })
        );
    };
}

export function logoutAccount(tokenId) {
    return (dispatch) => {
        return dispatch(api.endpoints.logout.initiate({ tokenId }));
    };
}

export function logout() {
    return (dispatch, getState) => {
        let state = getState();

        if (!state.auth.refreshToken) {
            return;
        }

        if (state.lobby.socket) {
            state.lobby.socket.closing = true;
            state.lobby.socket.disconnect();

            dispatch(connectLobby());
        }

        if (state.games.socket) {
            state.games.socket.disconnect();
        }

        return dispatch(logoutAccount(state.auth.refreshToken.id));
    };
}

export function forgotPassword(details) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    return (dispatch) => {
        return dispatch(
            api.endpoints.forgotPassword.initiate({
                username: details.username,
                captcha: details.captcha
            })
        );
    };
}

export function resetPassword(details) {
    return (dispatch) => {
        return dispatch(
            api.endpoints.resetPassword.initiate({
                id: details.id,
                token: details.token,
                newPassword: details.newPassword
            })
        );
    };
}

export function verifyAuthentication() {
    return (dispatch) => {
        return dispatch(api.endpoints.verifyAuth.initiate());
    };
}

export function authenticate() {
    return (dispatch, getState) => {
        dispatch(verifyAuthentication());

        const state = getState();
        if (state.auth.token) {
            return dispatch(sendAuthenticate(state.auth.token));
        }
    };
}

export function linkPatreon(code) {
    return (dispatch) => {
        return dispatch(api.endpoints.linkPatreon.initiate({ code }));
    };
}

export function unlinkPatreon() {
    return (dispatch) => {
        return dispatch(api.endpoints.unlinkPatreon.initiate());
    };
}
