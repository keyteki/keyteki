function challonge(state = {
    challonge: { tournaments: [], matches: [], participants: [] }
}, action) {
    switch(action.type) {
        case 'REQUEST_TOURNAMENTS':
            return Object.assign({}, state, {});
        case 'REQUEST_MATCHES':
            return Object.assign({}, state, {});
        case 'REQUEST_PARTICIPANTS':
            return Object.assign({}, state, {});
        case 'RECEIVE_TOURNAMENTS':
            return Object.assign({}, state, {
                tournaments: action.response.data
            });
        case 'RECEIVE_MATCHES':
            return Object.assign({}, state, {
                matches: action.response.data
            });
        case 'RECEIVE_ATTACHMENTS':
            return Object.assign({}, state, {
                matches: action.response.data
            });
        case 'RECEIVE_PARTICIPANTS':
            return Object.assign({}, state, {
                participants: action.response.data
            });
        default:
            return state;
    }
}

export default challonge;
