export function receiveUsers(users) {
    return {
        type: 'RECEIVE_USERS',
        users: users
    };
}

export function receiveLobbyMessage(message) {
    return {
        type: 'RECEIVE_LOBBY_MSG',
        message: message
    };
}

export function receiveLobbyMessages(messages) {
    return {
        type: 'RECEIVE_LOBBY_MSGS',
        messages: messages
    };
}
