export default function (state = {}, action) {
    switch (action.type) {
        case 'REGISTER_ACCOUNT':
            return Object.assign({}, state, {
                registered: false
            });
        case 'ACCOUNT_REGISTERED':
            return Object.assign({}, state, {
                registered: true
            });
        case 'LOGIN_ACCOUNT':
            return Object.assign({}, state, {
                loggedIn: false
            });
        case 'ACCOUNT_LOGGEDIN':
            return Object.assign({}, state, {
                loggedIn: true,
                user: action.response.user
            });
        case 'ACCOUNT_LOGGEDOUT':
            return Object.assign({}, state, {
                loggedIn: false,
                loggedOut: true,
                user: undefined
            });
        case 'RESETPASSWORD_ACCOUNT':
            return Object.assign({}, state, {
                passwordReset: false
            });
        case 'ACCOUNT_PASSWORDRESET':
            return Object.assign({}, state, {
                passwordReset: true
            });
        case 'ACTIVATE_ACCOUNT':
            return Object.assign({}, state, {
                activated: false
            });
        case 'ACCOUNT_ACTIVATED':
            return Object.assign({}, state, {
                activated: true
            });
        case 'ACCOUNT_AUTH_VERIFIED':
            return Object.assign({}, state, {
                loggedIn: true,
                user: action.response.user
            });
        case 'PROFILE_SAVED':
            return Object.assign({}, state, {
                user: action.response.user
            });
        case 'ACCOUNT_LINK_RESPONSE':
            return Object.assign({}, state, {
                accountLinked: true
            });
        case 'CLEAR_LINK_STATUS':
            return Object.assign({}, state, {
                accountLinked: undefined
            });
        case 'ACCOUNT_UNLINKED':
            var user = state.user;

            if (user) {
                user.patreon = undefined;
            }

            return Object.assign({}, state, {
                accountLinked: undefined,
                user: user
            });
    }

    return state;
}
