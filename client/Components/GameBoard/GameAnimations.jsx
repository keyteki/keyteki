import React, { useEffect, useRef, useState } from 'react';
import AmberImage from '../../assets/img/amber.png';

const ANIMATION_DURATION = 800;

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

    useEffect(() => {
        if (!animations || animations.length === 0) {
            processedIdsRef.current.clear();
            return;
        }

        const newAnimations = [];
        const amberElCache = {};

        for (const anim of animations) {
            if (processedIdsRef.current.has(anim.id)) {
                continue;
            }

            processedIdsRef.current.add(anim.id);

            if (anim.type === 'reap') {
                const cardEl = document.querySelector(`[data-uuid="${anim.cardUuid}"]`);
                const side = anim.player === thisPlayerName ? 'bottom' : 'top';

                if (!amberElCache[side]) {
                    amberElCache[side] = document.querySelector(
                        `[data-stat="amber"][data-player-side="${side}"]`
                    );
                }

                const amberEl = amberElCache[side];

                if (cardEl && amberEl) {
                    const cardRect = cardEl.getBoundingClientRect();
                    const amberRect = amberEl.getBoundingClientRect();

                    newAnimations.push({
                        id: anim.id,
                        startX: cardRect.left + cardRect.width / 2,
                        startY: cardRect.top + cardRect.height / 3,
                        endX: amberRect.left + amberRect.width / 2,
                        endY: amberRect.top + amberRect.height / 2
                    });
                }
            }
        }

        if (newAnimations.length > 0) {
            setActiveAnimations((prev) => [...prev, ...newAnimations]);

            const ids = newAnimations.map((a) => a.id);
            const timeoutId = setTimeout(() => {
                setActiveAnimations((prev) => prev.filter((a) => !ids.includes(a.id)));
                timeoutsRef.current = timeoutsRef.current.filter((t) => t !== timeoutId);
            }, ANIMATION_DURATION);
            timeoutsRef.current.push(timeoutId);
        }
    }, [animations, thisPlayerName]);

    if (activeAnimations.length === 0) {
        return null;
    }

    return (
        <div className='game-animations-overlay'>
            {activeAnimations.map((anim) => (
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
            ))}
        </div>
    );
};

GameAnimations.displayName = 'GameAnimations';

export default GameAnimations;
