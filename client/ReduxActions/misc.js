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

export function setPlayer1CardBack(url) {
    return {
        type: 'PLAYER1_CARDBACK',
        url: url
    };
}

export function setPlayer2CardBack(url) {
    return {
        type: 'PLAYER2_CARDBACK',
        url: url
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
