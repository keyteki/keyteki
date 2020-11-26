import { Api } from '../types';

export function clearApiStatus(actionType) {
    return {
        type: Api.ClearApiStatus,
        request: actionType
    };
}
