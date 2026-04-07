import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import AmberImage from '../../assets/img/amber.png';

const ANIMATION_DURATION = 0.8;

const FIGHT_DURATION = 0.6;

const AnimationType = Object.freeze({
    Reap: 'reap',
    Fight: 'fight'
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
        endY: defenderRect.top + defenderRect.height / 2,
        damage: anim.damage
    };
};

const resolveAnimation = (anim, thisPlayerName) => {
    switch (anim.type) {
        case AnimationType.Reap:
            return resolveReapAnimation(anim, thisPlayerName);
        case AnimationType.Fight:
            return resolveFightAnimation(anim);
        default:
            return null;
    }
};

const FightArrow = ({ anim, onComplete }) => {
    const dx = anim.endX - anim.startX;
    const dy = anim.endY - anim.startY;
    const angle = Math.atan2(dy, dx);

    // Shorten the arrow so it doesn't overlap the card centers
    const margin = 30;
    const sx = anim.startX + Math.cos(angle) * margin;
    const sy = anim.startY + Math.sin(angle) * margin;
    const ex = anim.endX - Math.cos(angle) * margin;
    const ey = anim.endY - Math.sin(angle) * margin;

    const arrowSize = 12;
    const arrowAngle = Math.PI / 6;
    const arrow1X = ex - arrowSize * Math.cos(angle - arrowAngle);
    const arrow1Y = ey - arrowSize * Math.sin(angle - arrowAngle);
    const arrow2X = ex - arrowSize * Math.cos(angle + arrowAngle);
    const arrow2Y = ey - arrowSize * Math.sin(angle + arrowAngle);

    return (
        <motion.div
            className='fight-arrow-overlay'
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0] }}
            transition={{ duration: FIGHT_DURATION, times: [0, 0.7, 1] }}
            onAnimationComplete={onComplete}
        >
            <svg className='fight-arrow-svg' xmlns='http://www.w3.org/2000/svg'>
                <line x1={sx} y1={sy} x2={ex} y2={ey} className='fight-arrow-line' />
                <polyline
                    points={`${arrow1X},${arrow1Y} ${ex},${ey} ${arrow2X},${arrow2Y}`}
                    className='fight-arrow-head'
                />
                <text x={anim.endX} y={anim.endY - 20} className='fight-damage-text'>
                    {anim.damage}
                </text>
            </svg>
        </motion.div>
    );
};

const renderAnimation = (anim, onComplete) => {
    switch (anim.type) {
        case AnimationType.Fight:
            return <FightArrow key={anim.id} anim={anim} onComplete={onComplete} />;
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

const GameAnimations = ({ animations, thisPlayerName, onAnimationsComplete }) => {
    const [activeAnimations, setActiveAnimations] = useState([]);
    const processedIdsRef = useRef(new Set());
    const animatingRef = useRef(false);

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
            animatingRef.current = true;
            setActiveAnimations((prev) => [...prev, ...newAnimations]);
        }
    }, [animations, thisPlayerName]);

    useEffect(() => {
        if (animatingRef.current && activeAnimations.length === 0) {
            animatingRef.current = false;
            onAnimationsComplete?.();
        }
    }, [activeAnimations, onAnimationsComplete]);

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
