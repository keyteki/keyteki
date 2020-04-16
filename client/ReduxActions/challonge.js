export function fetchTournaments() {
    return {
        types: ['REQUEST_TOURNAMENTS', 'RECEIVE_TOURNAMENTS'],
        shouldCallAPI: () => true,
        APIParams: { url: '/api/challonge/tournaments', cache: false }
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

export function createAttachment(game, attachment) {
    const { tournamentId, matchId } = game.challonge;
    return {
        types: ['CREATE_ATTACHMENT', 'RECEIVE_ATTACHMENT'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/challonge/createAttachment',
            type: 'POST',
            data: JSON.stringify({ tournamentId, matchId, attachment }),
            cache: false
        }
    };
}
