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

export function setCardBack(player, url) {
    return {
        type: 'PLAYER_CARDBACK',
        player: player,
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
