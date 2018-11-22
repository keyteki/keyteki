export default function(state = {}, action) {
    switch(action.type) {
        case 'AUTH_REGISTER':
            var retState = Object.assign({}, state, {
                user: action.user,
                username: action.user.username,
                token: action.token,
                loggedIn: true
            });

            if(!retState.user.permissions) {
                retState.user.permissions = {};
            }

            return retState;
        case 'AUTH_LOGIN':
            return Object.assign({}, state, {
                user: action.user,
                username: action.user.username,
                token: action.token,
                isAdmin: action.isAdmin,
                loggedIn: true
            });
        case 'AUTH_LOGOUT':
            return Object.assign({}, state, {
                user: undefined,
                username: undefined,
                token: undefined,
                isAdmin: false,
                loggedIn: false
            });
        case 'REFRESH_USER':
            return Object.assign({}, state, {
                user: action.user,
                username: action.user.username,
                token: action.token
            });
    }

    return state;
}
