import $ from 'jquery';

export function findUser(username) {
    return {
        types: ['REQUEST_FINDUSER', 'RECEIVE_FINDUSER'],
        shouldCallAPI: () => true,
        callAPI: () => $.ajax('/api/user/' + username, { cache: false })
    };
}

export function saveUser(user) {
    return {
        types: ['SAVE_USER', 'USER_SAVED'],
        shouldCallAPI: () => true,
        callAPI: () => $.ajax('/api/user/' + user.username, {
            cache: false,
            type: 'PUT',
            data: { data: JSON.stringify(user) }
        })
    };
}

export function clearUserStatus() {
    return {
        type: 'CLEAR_USER_STATUS'
    };
}
