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

export function removeLobbyMessage(messageId) {
    return {
        types: ['REMOVE_MESSAGE', 'MESSAGE_REMOVED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/messages/${messageId}`,
            cache: false,
            type: 'DELETE'
        }
    };
}

export function clearChatStatus() {
    return {
        type: 'CLEAR_CHAT_STATUS'
    };
}
