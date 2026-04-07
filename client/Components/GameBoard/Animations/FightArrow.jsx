import React from 'react';
import { motion } from 'motion/react';
import { FIGHT_DURATION } from './constants';

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

export default FightArrow;
