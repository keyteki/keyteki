import { AnimationType } from './constants';

const getPlayerSide = (anim, thisPlayerName) => {
    return anim.player === thisPlayerName ? 'bottom' : 'top';
};

const getCardRect = (cardUuid) => {
    const el = document.querySelector(`[data-uuid="${CSS.escape(cardUuid)}"]`);
    return el ? el.getBoundingClientRect() : null;
};

const getStatRect = (stat, side) => {
    const el = document.querySelector(
        `[data-stat="${CSS.escape(stat)}"][data-player-side="${CSS.escape(side)}"]`
    );
    return el ? el.getBoundingClientRect() : null;
};

const resolveReapAnimation = (anim, thisPlayerName) => {
    const cardRect = getCardRect(anim.cardUuid);
    const side = getPlayerSide(anim, thisPlayerName);
    const amberRect = getStatRect('amber', side);

    if (!cardRect || !amberRect) {
        return null;
    }

    return {
        id: anim.id,
        type: AnimationType.Reap,
        startX: cardRect.left + cardRect.width / 2,
        startY: cardRect.top + cardRect.height / 3,
        endX: amberRect.left + amberRect.width / 2,
        endY: amberRect.top + amberRect.height / 2
    };
};

const resolveFightAnimation = (anim) => {
    const attackerRect = getCardRect(anim.attackerUuid);
    const defenderRect = getCardRect(anim.defenderUuid);

    if (!attackerRect || !defenderRect) {
        return null;
    }

    return {
        id: anim.id,
        type: AnimationType.Fight,
        startX: attackerRect.left + attackerRect.width / 2,
        startY: attackerRect.top + attackerRect.height / 2,
        endX: defenderRect.left + defenderRect.width / 2,
        endY: defenderRect.top + defenderRect.height / 2
    };
};

const resolveDamageAnimation = (anim) => {
    const cardRect = getCardRect(anim.cardUuid);

    if (!cardRect) {
        return null;
    }

    return {
        id: anim.id,
        type: AnimationType.Damage,
        x: cardRect.left + cardRect.width / 2,
        y: cardRect.top + cardRect.height / 3,
        amount: anim.amount,
        armorUsed: anim.armorUsed,
        fromFight: anim.fromFight
    };
};

const resolveAnimation = (anim, thisPlayerName) => {
    switch (anim.type) {
        case AnimationType.Reap:
            return resolveReapAnimation(anim, thisPlayerName);
        case AnimationType.Fight:
            return resolveFightAnimation(anim);
        case AnimationType.Damage:
            return resolveDamageAnimation(anim);
        default:
            return null;
    }
};

export const pruneProcessedIds = (processedIds, animations) => {
    const currentIds = new Set(animations.map((a) => a.id));
    for (const id of processedIds) {
        if (!currentIds.has(id)) {
            processedIds.delete(id);
        }
    }
};

export const resolveNewAnimations = (animations, processedIds, thisPlayerName) => {
    const resolved = [];

    for (const anim of animations) {
        if (processedIds.has(anim.id)) {
            continue;
        }

        const result = resolveAnimation(anim, thisPlayerName);
        if (result) {
            processedIds.add(anim.id);
            resolved.push(result);
        }
    }

    return resolved;
};
