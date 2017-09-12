import $ from 'jquery';

export function refreshUser(user, token) {
    return {
        type: 'REFRESH_USER',
        user: user,
        token: token
    };
}

export function loadBlockList(user) {
    return {
        types: ['REQUEST_BLOCKLIST', 'RECEIVE_BLOCKLIST'],
        shouldCallAPI: () => true,
        callAPI: () => {
            return $.ajax(`/api/account/${user.username}/blocklist`);
        }
    };
}

export function addBlockListEntry(user, username) {
    return {
        types: ['ADD_BLOCKLIST', 'BLOCKLIST_ADDED'],
        shouldCallAPI: () => true,
        callAPI: () => $.ajax({
            url: `/api/account/${user.username}/blocklist`,
            type: 'POST',
            data: { username: username }
        })
    };
}

export function removeBlockListEntry(user, username) {
    return {
        types: ['DELETE_BLOCKLIST', 'BLOCKLIST_DELETED'],
        shouldCallAPI: () => true,
        callAPI: () => $.ajax({
            url: `/api/account/${user.username}/blocklist/${username}`,
            type: 'DELETE'
        })
    };
}

export function clearBlockListStatus() {
    return {
        type: 'CLEAR_BLOCKLIST_STATUS'
    };
}
