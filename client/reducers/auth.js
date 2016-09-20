function login() {
    return { loggedIn: true };
}

function register() {
    return { loggedIn: true };
}

function logout() {
    return { loggedIn: false };
}

export default function(state = {}, action) {
    switch(action.type) {
        case 'AUTH_REGISTER':
            state = register();
            break;
        case 'AUTH_LOGIN':
            state = login();
            break;
        case 'AUTH_LOGOUT':
            state = logout();
            break;
    }

    return state;
}
