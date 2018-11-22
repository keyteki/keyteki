export default function(state = {}, action) {
    let loadingCount = state.loadingCount || 0;

    switch(action.type) {
        case 'API_FAILURE':
            loadingCount--;

            return Object.assign({}, state, {
                status: action.status,
                message: action.message,
                loading: loadingCount > 0,
                loadingCount: loadingCount
            });
        case 'API_LOADED':
            loadingCount--;

            return Object.assign({}, state, {
                loading: loadingCount > 0,
                loadingCount: loadingCount,
                message: undefined
            });
        case 'API_LOADING':
            loadingCount++;

            return Object.assign({}, state, {
                status: undefined,
                message: undefined,
                loading: loadingCount > 0,
                loadingCount: loadingCount
            });
    }

    return state;
}
