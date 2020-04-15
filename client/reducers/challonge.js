function challonge(state = {
    challonge: { tournaments: [], matches: [], participants: [] }
}, action) {
    switch(action.type) {
        case 'REQUEST_TOURNAMENTS':
            return Object.assign({}, state, {
            });
        case 'RECEIVE_TOURNAMENTS':
            return Object.assign({}, state, {
                tournaments: action.response.tournaments
            });
        case 'REQUEST_MATCHES':
            return Object.assign({}, state, {
            });
        case 'RECEIVE_MATCHES':
            return Object.assign({}, state, {
                matches: action.response.data.matches,
                participants: action.response.data.participants
            });
        default:
            return state;
    }
}

export default challonge;
