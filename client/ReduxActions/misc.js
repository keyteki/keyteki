export function navigate(path, search = '', noHistory = false) {
    return {
        type: 'NAVIGATE',
        newPath: path,
        search: search,
        noHistory: noHistory
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
