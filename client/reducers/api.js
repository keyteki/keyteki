export default function(state = {}, action) {
    let retState = Object.assign({}, state);

    switch(action.type) {
        case 'API_FAILURE':
            retState[action.request] = {
                status: action.status,
                message: action.message,
                success: false
            };

            return retState;
        case 'API_LOADED':
            retState[action.request] = {
                loading: false,
                message: undefined,
                status: action.status,
                success: true
            };
            return retState;
        case 'API_LOADING':
            retState[action.request] = {
                status: undefined,
                message: undefined,
                loading: true
            };

            return retState;
    }

    return state;
}
