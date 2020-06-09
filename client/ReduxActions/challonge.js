export function fetchTournaments() {
    return {
        types: ['REQUEST_TOURNAMENTS', 'RECEIVE_TOURNAMENTS'],
        shouldCallAPI: () => true,
        APIParams: { url: '/api/challonge/tournaments', cache: false }
    };
}

export function fetchFullTournament(tournamentId) {
    return {
        types: ['REQUEST_FULL_TOURNAMENT', 'RECEIVE_FULL_TOURNAMENT'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/challonge/fullTournament',
            type: 'POST',
            data: JSON.stringify({ data: tournamentId }),
            cache: false
        }
    };
}

export function fetchMatches(tournamentId) {
    return {
        types: ['REQUEST_MATCHES', 'RECEIVE_MATCHES'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/challonge/matches',
            type: 'POST',
            data: JSON.stringify({ data: tournamentId }),
            cache: false
        }
    };
}

export function fetchParticipants(tournamentId) {
    return {
        types: ['REQUEST_PARTICIPANTS', 'RECEIVE_PARTICIPANTS'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/challonge/participants',
            type: 'POST',
            data: JSON.stringify({ data: tournamentId }),
            cache: false
        }
    };
}

export function receiveTournaments(tournaments) {
    return {
        type: 'RECEIVE_TOURNAMENTS',
        tournaments: tournaments
    };
}

export function attachMatchLink(data) {
    return {
        types: ['CREATE_ATTACHMENTS', 'RECEIVE_ATTACHMENTS'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/challonge/attachMatchLink',
            type: 'POST',
            data: JSON.stringify(data),
            cache: false
        }
    };
}

export function clearChallongeMessage() {
    return {
        type: 'CLEAR_CHALLONGE_MESSAGE'
    };
}
