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
