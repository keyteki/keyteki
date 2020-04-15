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

export function receiveTournaments(tournaments) {
    return {
        type: 'RECEIVE_TOURNAMENTS',
        tournaments: tournaments
    };
}
