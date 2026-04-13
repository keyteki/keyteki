import './DamageAnimation';
import './FightArrow';
import './ForgeAnimation';
import './ReapAnimation';
import { getResolver } from './registry';

const resolveAnimation = (anim, thisPlayerName) => {
    const resolver = getResolver(anim.type);
    return resolver ? resolver(anim, thisPlayerName) : null;
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
