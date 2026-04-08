import React, { useCallback, useRef, useState } from 'react';
import { motion } from 'motion/react';
import AmberImage from '../../../assets/img/amber.png';
import { FORGE_DURATION, AnimationType } from './constants';
import { getKeyRect, getPlayAreaCenter, getPlayerSide, getStatRect } from './domHelpers';
import { registerAnimation } from './registry';

export const resolveForgeAnimation = (anim, thisPlayerName) => {
    const side = getPlayerSide(anim, thisPlayerName);
    const amberRect = getStatRect('amber', side);
    const keyRect = getKeyRect(anim.keyColor, side);
    const center = getPlayAreaCenter();

    if (!amberRect || !keyRect || !center) {
        return null;
    }

    return {
        id: anim.id,
        type: AnimationType.Forge,
        amberX: amberRect.left + amberRect.width / 2,
        amberY: amberRect.top + amberRect.height / 2,
        centerX: center.x,
        centerY: center.y,
        keyX: keyRect.left + keyRect.width / 2,
        keyY: keyRect.top + keyRect.height / 2,
        keyColor: anim.keyColor
    };
};

const PARTICLE_COUNT = 5;

const ForgedKeyImages = {
    red: new URL('../../../assets/img/forgedkeyred.png', import.meta.url).href,
    blue: new URL('../../../assets/img/forgedkeyblue.png', import.meta.url).href,
    yellow: new URL('../../../assets/img/forgedkeyyellow.png', import.meta.url).href
};

const sparkColors = {
    red: ['#ff6644', '#ff3311', '#ffaa33'],
    blue: ['#4488ff', '#2255ff', '#66bbff'],
    yellow: ['#ffdd33', '#ffaa11', '#ffee66']
};

// Phase timings (fractions of FORGE_DURATION)
const PARTICLE_PHASE = 0.25; // amber flies to center
const KEY_PHASE = 0.5; // key appears at center with sparks
const TRAVEL_PHASE = 0.25; // key shrinks to final position

const SPARK_COUNT = 8;

const ForgeAnimation = ({ anim, onComplete }) => {
    const [phase, setPhase] = useState('particles'); // particles -> key -> travel
    const particlesDone = useRef(0);

    const onParticleComplete = useCallback(() => {
        particlesDone.current += 1;
        if (particlesDone.current >= PARTICLE_COUNT) {
            setPhase('key');
        }
    }, []);

    const onKeyPhaseComplete = useCallback(() => {
        setPhase('travel');
    }, []);

    const particleDuration = FORGE_DURATION * PARTICLE_PHASE;
    const keyDuration = FORGE_DURATION * KEY_PHASE;
    const travelDuration = FORGE_DURATION * TRAVEL_PHASE;
    const colors = sparkColors[anim.keyColor] || sparkColors.yellow;

    return (
        <motion.div className='forge-animation-overlay' exit={{ opacity: 0 }}>
            {/* Phase 1: Amber particles fly from amber pool to screen center */}
            {phase === 'particles' &&
                Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
                    const stagger = i * 0.04;
                    const offsetX = (i - 2) * 10;
                    const offsetY = ((i % 3) - 1) * 8;
                    const midX = (anim.amberX + anim.centerX) / 2 + offsetX * 2;
                    const midY = (anim.amberY + anim.centerY) / 2 - 30 + offsetY;

                    return (
                        <motion.div
                            key={`forge-particle-${anim.id}-${i}`}
                            className='forge-amber-particle'
                            initial={{
                                left: anim.amberX + offsetX,
                                top: anim.amberY + offsetY,
                                opacity: 0,
                                scale: 0.2
                            }}
                            animate={{
                                left: [anim.amberX + offsetX, midX, anim.centerX],
                                top: [anim.amberY + offsetY, midY, anim.centerY],
                                opacity: [0, 1, 0.8],
                                scale: [0.2, 1.2, 0.6]
                            }}
                            transition={{
                                delay: stagger,
                                duration: particleDuration,
                                ease: 'easeIn',
                                times: [0, 0.5, 1]
                            }}
                            onAnimationComplete={onParticleComplete}
                        >
                            <img src={AmberImage} alt='' className='forge-amber-icon' />
                        </motion.div>
                    );
                })}

            {/* Phase 2: Forged key appears at center with spark effects */}
            {phase === 'key' && (
                <>
                    {/* Sparks radiating outward */}
                    {Array.from({ length: SPARK_COUNT }).map((_, i) => {
                        const angle = (i / SPARK_COUNT) * Math.PI * 2;
                        const distance = 60 + (i % 3) * 20;
                        const endX = anim.centerX + Math.cos(angle) * distance;
                        const endY = anim.centerY + Math.sin(angle) * distance;

                        return (
                            <motion.div
                                key={`forge-spark-${anim.id}-${i}`}
                                className='forge-spark'
                                style={{ backgroundColor: colors[i % colors.length] }}
                                initial={{
                                    left: anim.centerX,
                                    top: anim.centerY,
                                    opacity: 1,
                                    scale: 1
                                }}
                                animate={{
                                    left: endX,
                                    top: endY,
                                    opacity: [1, 1, 0],
                                    scale: [1, 0.8, 0.2]
                                }}
                                transition={{
                                    delay: 0.05 + (i % 3) * 0.04,
                                    duration: keyDuration * 0.6,
                                    ease: 'easeOut',
                                    times: [0, 0.5, 1]
                                }}
                            />
                        );
                    })}

                    {/* Glow ring behind the key */}
                    <motion.div
                        className={`forge-glow-ring forge-glow-${anim.keyColor}`}
                        style={{ left: anim.centerX, top: anim.centerY }}
                        initial={{ opacity: 0, scale: 0.3 }}
                        animate={{
                            opacity: [0, 0.8, 0.6, 0],
                            scale: [0.3, 1.2, 1.5, 2]
                        }}
                        transition={{
                            duration: keyDuration,
                            ease: 'easeOut',
                            times: [0, 0.2, 0.6, 1]
                        }}
                    />

                    {/* Forged key image */}
                    <motion.div
                        className='forge-key-center'
                        style={{ left: anim.centerX, top: anim.centerY }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 1, 1, 1],
                            scale: [0, 1.6, 1.3, 1.3]
                        }}
                        transition={{
                            duration: keyDuration,
                            ease: 'easeOut',
                            times: [0, 0.15, 0.4, 1]
                        }}
                        onAnimationComplete={onKeyPhaseComplete}
                    >
                        <img
                            src={ForgedKeyImages[anim.keyColor]}
                            alt=''
                            className='forge-key-image'
                        />
                    </motion.div>
                </>
            )}

            {/* Phase 3: Key shrinks and travels to its final position */}
            {phase === 'travel' && (
                <motion.div
                    className='forge-key-center'
                    style={{ left: anim.centerX, top: anim.centerY }}
                    initial={{ opacity: 1, scale: 1.3 }}
                    animate={{
                        left: anim.keyX,
                        top: anim.keyY,
                        opacity: [1, 1, 0.8],
                        scale: [1.3, 0.8, 0.4]
                    }}
                    transition={{
                        duration: travelDuration,
                        ease: 'easeIn',
                        times: [0, 0.6, 1]
                    }}
                    onAnimationComplete={onComplete}
                >
                    <img src={ForgedKeyImages[anim.keyColor]} alt='' className='forge-key-image' />
                </motion.div>
            )}
        </motion.div>
    );
};

registerAnimation(AnimationType.Forge, {
    component: ForgeAnimation,
    resolver: resolveForgeAnimation
});

export default ForgeAnimation;
