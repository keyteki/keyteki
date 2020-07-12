import { Challonge } from '../types';

export function fetchTournaments() {
    return {
        types: [Challonge.RequestTournaments, Challonge.RecevieTournaments],
        shouldCallAPI: () => true,
        APIParams: { url: '/api/challonge/tournaments', cache: false }
    };
}

export function fetchFullTournament(tournamentId) {
    return {
        types: [Challonge.RequestFullTournament, Challonge.ReceiveFullTournament],
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
        types: [Challonge.RequestMatches, Challonge.ReceiveMatches],
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
        types: [Challonge.RequestParticipants, Challonge.ReceiveParticipants],
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
        type: Challonge.RecevieTournaments,
        tournaments: tournaments
    };
}

export function attachMatchLink(data) {
    return {
        types: [Challonge.CreateAttachments, Challonge.ReceiveAttachments],
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
        type: Challonge.ClearMessage
    };
}
