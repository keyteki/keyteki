import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AnimationType } from './constants';
import { pruneProcessedIds, resolveNewAnimations } from './animationResolvers';
import DamageAnimation from './DamageAnimation';
import FightArrow from './FightArrow';
import ForgeAnimation from './ForgeAnimation';
import ReapAnimation from './ReapAnimation';

const renderAnimation = (anim, onComplete) => {
    switch (anim.type) {
        case AnimationType.Fight:
            return <FightArrow key={anim.id} anim={anim} onComplete={onComplete} />;
        case AnimationType.Reap:
            return <ReapAnimation key={anim.id} anim={anim} onComplete={onComplete} />;
        case AnimationType.Damage:
            return <DamageAnimation key={anim.id} anim={anim} onComplete={onComplete} />;
        case AnimationType.Forge:
            return <ForgeAnimation key={anim.id} anim={anim} onComplete={onComplete} />;
        default:
            return null;
    }
};

const GameAnimations = ({ animations, thisPlayerName, onAnimationsComplete }) => {
    const [activeAnimations, setActiveAnimations] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const processedIdsRef = useRef(new Set());
    const prevAnimationsRef = useRef(animations);

    useLayoutEffect(() => {
        const isNewBatch = animations !== prevAnimationsRef.current;
        prevAnimationsRef.current = animations;

        if (!animations || animations.length === 0 || !isNewBatch) {
            return;
        }

        pruneProcessedIds(processedIdsRef.current, animations);

        const newAnimations = resolveNewAnimations(
            animations,
            processedIdsRef.current,
            thisPlayerName
        );

        if (newAnimations.length > 0) {
            setIsAnimating(true);
            setActiveAnimations((prev) => [...prev, ...newAnimations]);
        } else if (!isAnimating) {
            onAnimationsComplete();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animations, thisPlayerName]);

    useEffect(() => {
        if (isAnimating && activeAnimations.length === 0) {
            setIsAnimating(false);
            onAnimationsComplete();
        }
    }, [activeAnimations, isAnimating, onAnimationsComplete]);

    // Safety timeout: unfreeze the board if animations get stuck
    useEffect(() => {
        if (!isAnimating) {
            return;
        }

        const timer = setTimeout(() => {
            setActiveAnimations([]);
            setIsAnimating(false);
            onAnimationsComplete();
        }, 5000);

        return () => clearTimeout(timer);
    }, [isAnimating, onAnimationsComplete]);

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
