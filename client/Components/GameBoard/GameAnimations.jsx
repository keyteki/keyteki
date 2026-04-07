import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import AmberImage from '../../assets/img/amber.png';

const ANIMATION_DURATION = 0.8;

const FIGHT_DURATION = 0.7;

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

    const arrowSize = 14;
    const arrowAngle = Math.PI / 6;
    const arrow1X = ex - arrowSize * Math.cos(angle - arrowAngle);
    const arrow1Y = ey - arrowSize * Math.sin(angle - arrowAngle);
    const arrow2X = ex - arrowSize * Math.cos(angle + arrowAngle);
    const arrow2Y = ey - arrowSize * Math.sin(angle + arrowAngle);

    const gradientId = `arrow-grad-${anim.id}`;
    const glowId = `arrow-glow-${anim.id}`;
    const impactId = `impact-${anim.id}`;

    return (
        <motion.div
            className='fight-arrow-overlay'
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0] }}
            transition={{ duration: FIGHT_DURATION, times: [0, 0.9, 1] }}
            onAnimationComplete={onComplete}
        >
            <svg className='fight-arrow-svg' xmlns='http://www.w3.org/2000/svg'>
                <defs>
                    <linearGradient
                        id={gradientId}
                        x1={sx}
                        y1={sy}
                        x2={ex}
                        y2={ey}
                        gradientUnits='userSpaceOnUse'
                    >
                        <stop offset='0%' stopColor='#ff6666' />
                        <stop offset='50%' stopColor='#ff2222' />
                        <stop offset='100%' stopColor='#cc0000' />
                    </linearGradient>
                    <filter id={glowId}>
                        <feGaussianBlur stdDeviation='3' result='blur' />
                        <feMerge>
                            <feMergeNode in='blur' />
                            <feMergeNode in='SourceGraphic' />
                        </feMerge>
                    </filter>
                    <filter id={impactId}>
                        <feGaussianBlur stdDeviation='6' result='blur' />
                        <feMerge>
                            <feMergeNode in='blur' />
                            <feMergeNode in='blur' />
                            <feMergeNode in='SourceGraphic' />
                        </feMerge>
                    </filter>
                </defs>

                {/* Black outline behind the arrow for contrast on light backgrounds */}
                <motion.line
                    x1={sx}
                    y1={sy}
                    x2={ex}
                    y2={ey}
                    className='fight-arrow-outline'
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: FIGHT_DURATION * 0.4, ease: 'easeOut' }}
                />

                {/* Glow trail behind the arrow */}
                <motion.line
                    x1={sx}
                    y1={sy}
                    x2={ex}
                    y2={ey}
                    className='fight-arrow-trail'
                    initial={{ pathLength: 0, opacity: 0.5 }}
                    animate={{ pathLength: 1, opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: FIGHT_DURATION * 0.6, ease: 'easeOut' }}
                />

                {/* Main arrow line with gradient */}
                <motion.line
                    x1={sx}
                    y1={sy}
                    x2={ex}
                    y2={ey}
                    stroke={`url(#${gradientId})`}
                    strokeWidth='3.5'
                    strokeLinecap='round'
                    filter={`url(#${glowId})`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: FIGHT_DURATION * 0.4, ease: 'easeOut' }}
                />

                {/* Black outline behind arrow head */}
                <motion.polygon
                    points={`${arrow1X},${arrow1Y} ${ex},${ey} ${arrow2X},${arrow2Y}`}
                    className='fight-arrow-head-outline'
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: FIGHT_DURATION * 0.3, duration: 0.15 }}
                />

                {/* Arrow head */}
                <motion.polygon
                    points={`${arrow1X},${arrow1Y} ${ex},${ey} ${arrow2X},${arrow2Y}`}
                    className='fight-arrow-head'
                    fill={`url(#${gradientId})`}
                    stroke={`url(#${gradientId})`}
                    filter={`url(#${glowId})`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: FIGHT_DURATION * 0.3, duration: 0.15 }}
                />

                {/* Impact burst at the endpoint */}
                <motion.circle
                    cx={ex}
                    cy={ey}
                    r='4'
                    className='fight-impact-burst'
                    filter={`url(#${impactId})`}
                    initial={{ r: 4, opacity: 0 }}
                    animate={{ r: 20, opacity: [0, 0.8, 0] }}
                    transition={{ delay: FIGHT_DURATION * 0.4, duration: 0.3, ease: 'easeOut' }}
                />

                {/* Damage text */}
                <motion.text
                    x={ex}
                    y={ey - 15}
                    className='fight-damage-text'
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: [0.3, 1.4, 1] }}
                    transition={{ delay: FIGHT_DURATION * 0.2, duration: 0.1, ease: 'backOut' }}
                >
                    {anim.damage}
                </motion.text>
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
