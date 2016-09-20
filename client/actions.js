export function navigate(path) {
    return {
        type: 'NAVIGATE',
        newPath: path
    };
}

export function register() {
    return {
        type: 'AUTH_REGISTER'
    };
}

export function login() {
    return {
        type: 'AUTH_LOGIN'
    };
}

export function logout() {
    return {
        type: 'AUTH_LOGOUT'
    };
}
