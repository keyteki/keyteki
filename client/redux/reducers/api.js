import { Api } from '../types';

export default function (state = {}, action) {
    let retState = Object.assign({}, state);

    switch (action.type) {
        case Api.ApiFailure:
            retState[action.request] = {
                status: action.status,
                message: action.message,
                success: false
            };

            break;
        case Api.ApiLoaded:
            retState[action.request] = {
                loading: false,
                message: undefined,
                status: action.status,
                success: true
            };

            break;
        case Api.ApiLoading:
            retState[action.request] = {
                status: undefined,
                message: undefined,
                loading: true
            };

            break;
        case Api.ClearApiStatus:
            retState[action.request] = undefined;
            break;
        default:
            return state;
    }

    return retState;
}
