import { Admin } from '../types';
import { lobbySendMessage } from '../socketActions';

export function findUser(username) {
    return {
        types: [Admin.FindUser, Admin.UserFound],
        shouldCallAPI: () => true,
        APIParams: { url: `/api/user/${username}`, cache: false }
    };
}

export function clearUserSessions(username) {
    return (dispatch) => {
        dispatch(lobbySendMessage('clearsessions', username));
    };
}

export function saveUser(user) {
    return {
        types: [Admin.SaveUser, Admin.UserSaved],
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
