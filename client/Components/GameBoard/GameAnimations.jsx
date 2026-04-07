import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import AmberImage from '../../assets/img/amber.png';

const ANIMATION_DURATION = 800;

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

const renderAnimation = (anim) => {
    switch (anim.type) {
        case AnimationType.Reap:
            return (
                <div
                    key={anim.id}
                    className='reap-amber-animation'
                    style={{
                        '--start-x': `${anim.startX}px`,
                        '--start-y': `${anim.startY}px`,
                        '--end-x': `${anim.endX}px`,
                        '--end-y': `${anim.endY}px`,
                        animationDuration: `${ANIMATION_DURATION}ms`
                    }}
                >
                    <img src={AmberImage} alt='amber' className='reap-amber-icon' />
                </div>
            );
        default:
            return null;
    }
};

const scheduleCleanup = (newAnimations, setActiveAnimations, timeoutsRef) => {
    const ids = newAnimations.map((a) => a.id);
    const timeoutId = setTimeout(() => {
        setActiveAnimations((prev) => prev.filter((a) => !ids.includes(a.id)));
        timeoutsRef.current = timeoutsRef.current.filter((t) => t !== timeoutId);
    }, ANIMATION_DURATION);
    timeoutsRef.current.push(timeoutId);
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
    const timeoutsRef = useRef([]);

    useEffect(() => {
        return () => {
            for (const t of timeoutsRef.current) {
                clearTimeout(t);
            }
        };
    }, []);

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
            scheduleCleanup(newAnimations, setActiveAnimations, timeoutsRef);
        }
    }, [animations, thisPlayerName]);

    if (activeAnimations.length === 0) {
        return null;
    }

    return (
        <div className='game-animations-overlay'>
            {activeAnimations.map((anim) => renderAnimation(anim))}
        </div>
    );
};

GameAnimations.displayName = 'GameAnimations';

export default GameAnimations;
