import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AnimationType } from './constants';
import { pruneProcessedIds, resolveNewAnimations } from './animationResolvers';
import FightArrow from './FightArrow';
import ReapAnimation from './ReapAnimation';

const renderAnimation = (anim, onComplete) => {
    switch (anim.type) {
        case AnimationType.Fight:
            return <FightArrow key={anim.id} anim={anim} onComplete={onComplete} />;
        case AnimationType.Reap:
            return <ReapAnimation key={anim.id} anim={anim} onComplete={onComplete} />;
        default:
            return null;
    }
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
