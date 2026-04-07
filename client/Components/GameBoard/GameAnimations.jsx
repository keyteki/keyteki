import React, { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import AmberImage from '../../assets/img/amber.png';

const ANIMATION_DURATION = 0.8;

const AnimationType = Object.freeze({
    Reap: 'reap'
});

const getPlayerSide = (anim, thisPlayerName) => {
    return anim.player === thisPlayerName ? 'bottom' : 'top';
};

const getCardRect = (cardUuid) => {
    const el = document.querySelector(`[data-uuid="${cardUuid}"]`);
    return el ? el.getBoundingClientRect() : null;
};

const getStatRect = (stat, side) => {
    const el = document.querySelector(`[data-stat="${stat}"][data-player-side="${side}"]`);
    return el ? el.getBoundingClientRect() : null;
};

const resolveReapAnimation = (anim, thisPlayerName) => {
    const cardRect = getCardRect(anim.cardUuid);
    const amberRect = getStatRect('amber', getPlayerSide(anim, thisPlayerName));

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

const resolveAnimation = (anim, thisPlayerName) => {
    switch (anim.type) {
        case AnimationType.Reap:
            return resolveReapAnimation(anim, thisPlayerName);
        default:
            return null;
    }
};

const renderAnimation = (anim, onComplete) => {
    switch (anim.type) {
        case AnimationType.Reap:
            return (
                <motion.div
                    key={anim.id}
                    className='reap-amber-animation'
                    initial={{
                        left: anim.startX,
                        top: anim.startY,
                        opacity: 0,
                        scale: 0.3
                    }}
                    animate={{
                        left: [anim.startX, anim.startX, anim.startX, anim.endX],
                        top: [anim.startY, anim.startY, anim.startY, anim.endY],
                        opacity: [0, 1, 1, 0],
                        scale: [0.3, 1.3, 1, 0.5]
                    }}
                    transition={{
                        duration: ANIMATION_DURATION,
                        ease: 'easeOut',
                        times: [0, 0.2, 0.4, 1]
                    }}
                    exit={{ opacity: 0 }}
                    onAnimationComplete={onComplete}
                >
                    <img src={AmberImage} alt='amber' className='reap-amber-icon' />
                </motion.div>
            );
        default:
            return null;
    }
};

const pruneProcessedIds = (processedIds, animations) => {
    const currentIds = new Set(animations.map((a) => a.id));
    for (const id of processedIds) {
        if (!currentIds.has(id)) {
            processedIds.delete(id);
        }
    }
};

const resolveNewAnimations = (animations, processedIds, thisPlayerName) => {
    const resolved = [];

    for (const anim of animations) {
        if (processedIds.has(anim.id)) {
            continue;
        }

        processedIds.add(anim.id);

        const result = resolveAnimation(anim, thisPlayerName);
        if (result) {
            resolved.push(result);
        }
    }

    return resolved;
};

const GameAnimations = ({ animations, thisPlayerName }) => {
    const [activeAnimations, setActiveAnimations] = useState([]);
    const processedIdsRef = useRef(new Set());

    useLayoutEffect(() => {
        if (!animations || animations.length === 0) {
            return;
        }

        pruneProcessedIds(processedIdsRef.current, animations);

        const newAnimations = resolveNewAnimations(
            animations,
            processedIdsRef.current,
            thisPlayerName
        );

        if (newAnimations.length > 0) {
            setActiveAnimations((prev) => [...prev, ...newAnimations]);
        }
    }, [animations, thisPlayerName]);

    return (
        <div className='game-animations-overlay'>
            <AnimatePresence>
                {activeAnimations.map((anim) =>
                    renderAnimation(anim, () =>
                        setActiveAnimations((prev) => prev.filter((a) => a.id !== anim.id))
                    )
                )}
            </AnimatePresence>
        </div>
    );
};

GameAnimations.displayName = 'GameAnimations';

export default GameAnimations;
