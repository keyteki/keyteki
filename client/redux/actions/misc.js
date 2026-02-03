import { routerNavigate } from '../../router/navigate';

export function navigate(path, search = '', noHistory = false) {
    return (dispatch) => {
        routerNavigate(`${path}${search || ''}`, { replace: noHistory });

        dispatch({
            type: 'NAVIGATE',
            newPath: path,
            search: search,
            noHistory: noHistory
        });
    };
}

export function setUrl(path) {
    return (dispatch) => {
        routerNavigate(path, { replace: true });

        dispatch({
            type: 'SET_URL',
            path: path
        });
    };
}

export function receiveBannerNotice(notice) {
    return {
        type: 'RECEIVE_BANNER_NOTICE',
        notice: notice
    };
}

export function clearChatStatus() {
    return {
        type: 'CLEAR_CHAT_STATUS'
    };
}

export function setWindowBlur(type) {
    return {
        type: `WINDOW_${type.toUpperCase()}`
    };
}
