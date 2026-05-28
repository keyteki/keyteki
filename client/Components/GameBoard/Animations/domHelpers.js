export const getPlayerSide = (anim, thisPlayerName) => {
    return anim.player === thisPlayerName ? 'bottom' : 'top';
};

export const getCardRect = (cardUuid) => {
    const el = document.querySelector(`[data-uuid="${CSS.escape(cardUuid)}"]`);
    return el ? el.getBoundingClientRect() : null;
};

export const getStatRect = (stat, side) => {
    const el = document.querySelector(
        `[data-stat="${CSS.escape(stat)}"][data-player-side="${CSS.escape(side)}"]`
    );
    return el ? el.getBoundingClientRect() : null;
};

export const getKeyRect = (keyColor, side) => {
    const el = document.querySelector(
        `[data-key-color="${CSS.escape(keyColor)}"][data-player-side="${CSS.escape(side)}"]`
    );
    return el ? el.getBoundingClientRect() : null;
};

export const getPlayAreaCenter = () => {
    const el = document.querySelector('.play-area');
    if (!el) {
        return null;
    }
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};
