export function navigate(path, search) {
    return {
        type: 'NAVIGATE',
        newPath: path,
        search: search
    };
}

export function setUrl(path) {
    return {
        type: 'SET_URL',
        path: path
    };
}

export function setContextMenu(menu) {
    return {
        type: 'SET_CONTEXT_MENU',
        menu: menu
    };
}

export function zoomCard(card) {
    return {
        type: 'ZOOM_CARD',
        card: card
    };
}

export function clearZoom() {
    return {
        type: 'CLEAR_ZOOM'
    };
}

export function receiveBannerNotice(notice) {
    return {
        type: 'RECEIVE_BANNER_NOTICE',
        notice: notice
    };
}

export function refreshUser(user, token) {
    return {
        type: 'REFRESH_USER',
        user: user,
        token: token
    };
}
