export function register(user, token) {
    return {
        type: 'AUTH_REGISTER',
        user: user,
        token: token
    };
}

export function login(user, token, isAdmin) {
    return {
        type: 'AUTH_LOGIN',
        user: user,
        token: token,
        isAdmin: isAdmin
    };
}

export function logout() {
    return {
        type: 'AUTH_LOGOUT'
    };
}
