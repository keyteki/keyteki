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
        case 'REQUEST_TOURNAMENTS':
            return Object.assign({}, state, {});
        case 'REQUEST_FULL_TOURNAMENT':
            return Object.assign({}, state, {});
        case 'REQUEST_MATCHES':
            return Object.assign({}, state, {});
        case 'REQUEST_PARTICIPANTS':
            return Object.assign({}, state, {});
        case 'CREATE_ATTACHMENTS':
            return Object.assign({}, state, {});
        case 'RECEIVE_TOURNAMENTS':
            return Object.assign({}, state, {
                message: action.response.message,
                success: action.response.success,
                tournaments: action.response.data
            });
        case 'RECEIVE_FULL_TOURNAMENT':
            return Object.assign({}, state, {
                matches: action.response.matches,
                message: action.response.message,
                participants: action.response.participants,
                success: action.response.success
            });
        case 'RECEIVE_MATCHES':
            return Object.assign({}, state, {
                message: action.response.message,
                matches: action.response.data,
                success: action.response.success
            });
        case 'RECEIVE_ATTACHMENTS':
            return Object.assign({}, state, {
                message: action.response.message,
                success: action.response.success,
                attachments: action.response.attachments
            });
        case 'RECEIVE_PARTICIPANTS':
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
