import { Challonge } from '../types';

function challonge(
    state = {
        challonge: {
            tournaments: [],
            matches: [],
            participants: [],
            attachments: [],
            message: '',
            success: false
        }
    },
    action
) {
    switch (action.type) {
        case Challonge.RecevieTournaments:
            return Object.assign({}, state, {
                message: action.response.message,
                success: action.response.success,
                tournaments: action.response.data
            });
        case Challonge.ReceiveFullTournament:
            return Object.assign({}, state, {
                matches: action.response.matches,
                message: action.response.message,
                participants: action.response.participants,
                success: action.response.success
            });
        case Challonge.ReceiveMatches:
            return Object.assign({}, state, {
                message: action.response.message,
                matches: action.response.data,
                success: action.response.success
            });
        case Challonge.ReceiveAttachments:
            return Object.assign({}, state, {
                message: action.response.message,
                success: action.response.success,
                attachments: action.response.attachments
            });
        case Challonge.ReceiveParticipants:
            return Object.assign({}, state, {
                message: action.response.message,
                participants: action.response.data,
                success: action.response.success
            });
        default:
            return state;
    }
}

export default challonge;
