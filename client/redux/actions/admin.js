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

        if (!socket) {
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

export function verifyDeck(deckId) {
    return {
        types: ['VERIFY_DECK', 'DECK_VERIFIED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/decks/${deckId}/verify`,
            cache: false,
            type: 'POST'
        }
    };
}

export function verifyAllDecks(username) {
    return {
        types: ['VERIFY_DECKS', 'DECKS_VERIFIED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/user/${username}/verifyDecks`,
            cache: false,
            type: 'POST'
        }
    };
}

export function clearUserStatus() {
    return {
        type: 'CLEAR_USER_STATUS'
    };
}
