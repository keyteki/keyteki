import $ from 'jquery';

export function fetchBanlist() {
    return (dispatch) => {
        dispatch(requestBanlist());

        return $.ajax('/api/banlist').done(function (data) {
            dispatch(receiveBanlist(data));
        });
    };
}

export function requestBanlist() {
    return {
        type: 'REQUEST_BANLIST'
    };
}

export function receiveBanlist(list) {
    return {
        type: 'RECEIVE_BANLIST',
        banlist: list
    };
}

export function loadBanlist() {
    let params = {};

    return {
        types: ['REQUEST_BANLIST', 'RECEIVE_BANLIST'],
        shouldCallAPI: () => true,
        APIParams: { url: '/api/banlist/', cache: false, data: params }
    };
}

export function addBanlist(ip) {
    return {
        types: ['ADD_BANLIST', 'BANLIST_ADDED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/banlist',
            type: 'POST',
            data: JSON.stringify({ ip: ip })
        }
    };
}

export function deleteBanlist(id) {
    return {
        types: ['BANLIST_NEWS', 'BANLIST_DELETED'],
        shouldCallAPI: () => true,
        APIParams: {
            url: `/api/news/${id}`,
            type: 'DELETE'
        }
    };
}

export function clearbanlistStatus() {
    return {
        type: 'CLEAR_BANLIST_STATUS'
    };
}
