// @ts-nocheck
import { api } from '../slices/apiSlice';

// Re-export RTK Query hooks
export const {
    useFindUserMutation,
    useSaveUserMutation,
    useClearUserSessionsMutation,
    useLoadBanlistQuery,
    useAddBanlistMutation,
    useDeleteBanlistMutation,
    useVerifyDeckMutation,
    useVerifyAllDecksMutation
} = api;

export function findUser(username) {
    return (dispatch) => {
        return dispatch(api.endpoints.findUser.initiate(username));
    };
}

export function clearUserSessions(username) {
    return (dispatch, getState) => {
        var socket = getState().lobby.socket;

        if (!socket) {
            return;
        }

        socket.emit('clearsessions', username);
    };
}

export function saveUser(user) {
    return (dispatch) => {
        return dispatch(api.endpoints.saveUser.initiate(user));
    };
}

export function verifyDeck(deckId) {
    return (dispatch) => {
        return dispatch(api.endpoints.verifyDeck.initiate(deckId));
    };
}

export function verifyAllDecks(username) {
    return (dispatch) => {
        return dispatch(api.endpoints.verifyAllDecks.initiate(username));
    };
}

export function clearUserStatus() {
    return {
        type: 'CLEAR_USER_STATUS'
    };
}
