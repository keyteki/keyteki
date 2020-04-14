function challonge(state = {
    challonge: { tournaments: [] }
}, action) {
    switch(action.type) {
        case 'REQUEST_TOURNAMENTS':
            return Object.assign({}, state, {
            });
        case 'RECEIVE_TOURNAMENTS':
            return Object.assign({}, state, {
                tournaments: action.response.tournaments
            });
        default:
            return state;
    }
}

export default challonge;
