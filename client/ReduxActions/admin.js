export function findUser(username) {
    return {
        types: ['REQUEST_FINDUSER', 'RECEIVE_FINDUSER'],
        shouldCallAPI: () => true,
        APIParams: { url: `/api/user/${username}`, cache: false }
    };
}

export function clearUserSessions(username) {
    return (dispatch, getState) => {
        var socket = getState().lobby.socket;

        if(!socket) {
            return;
        }

        socket.emit('clearsessions', username);
    };
}

export function saveUser(user) {
    return {
        types: ['SAVE_USER', 'USER_SAVED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/user/${user.username}`,
            cache: false,
            type: 'PUT',
            data: JSON.stringify({ userToChange: user })
        }
    };
}

export function clearUserStatus() {
    return {
        type: 'CLEAR_USER_STATUS'
    };
}
