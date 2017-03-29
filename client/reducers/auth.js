function login(username, token, isAdmin = false) {
    return { username: username, token: token, loggedIn: true, isAdmin: isAdmin };
}

function register(username, token) {
    return { username: username, token: token, loggedIn: true };
}

function logout() {
    return { loggedIn: false };
}

export default function(state = {}, action) {
    switch(action.type) {
        case 'AUTH_REGISTER':
            state = register(action.username, action.token);
            break;
        case 'AUTH_LOGIN':
            state = login(action.username, action.token, action.isAdmin);
            break;
        case 'AUTH_LOGOUT':
            state = logout();
            break;
    }

    return state;
}
