export function fetchTournaments() {
    return {
        types: ['REQUEST_TOURNAMENTS', 'RECEIVE_TOURNAMENTS'],
        shouldCallAPI: () => true,
        APIParams: { url: '/api/challonge/tournaments', cache: false }
    };
}

export function receiveTournaments(tournaments) {
    return {
        type: 'RECEIVE_TOURNAMENTS',
        tournaments: tournaments
    };
}
