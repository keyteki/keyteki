export default function (state = {}, action) {
    switch (action.type) {
        case 'PROFILE_SAVED':
            return Object.assign({}, state, {
                token: action.response.token
            });
        case 'BLOCKLIST_ADDED':
        case 'BLOCKLIST_DELETED':
            return Object.assign({}, state, {
                user: action.response.user,
                username: action.response.user.username
            });
        case 'ACCOUNT_LOGGEDIN':
            localStorage.setItem('token', action.response.token);
            localStorage.setItem('refreshToken', JSON.stringify(action.response.refreshToken));

            return Object.assign({}, state, {
                token: action.response.token,
                refreshToken: action.response.refreshToken
            });
        case 'ACCOUNT_LOGGEDOUT':
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');

            return Object.assign({}, state, {
                token: undefined,
                refreshToken: undefined
            });
        case 'SET_AUTH_TOKENS':
            localStorage.setItem('token', action.token);
            if (action.refreshToken) {
                localStorage.setItem('refreshToken', JSON.stringify(action.refreshToken));
            }

            return Object.assign({}, state, {
                token: action.token,
                refreshToken: action.refreshToken,
                user: action.user || state.user
            });
    }

    return state;
}
