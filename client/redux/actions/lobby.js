// @ts-nocheck
import { api } from '../slices/apiSlice';

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
    return (dispatch) => {
        return dispatch(api.endpoints.removeLobbyMessage.initiate(messageId));
    };
}
