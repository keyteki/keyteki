import React from 'react';
import { motion } from 'motion/react';
import AmberImage from '../../../assets/img/amber.png';
import { ANIMATION_DURATION, AnimationType } from './constants';
import { getCardRect, getPlayerSide, getStatRect } from './domHelpers';
import { registerAnimation } from './registry';

export const resolveReapAnimation = (anim, thisPlayerName) => {
    const cardRect = getCardRect(anim.cardUuid);
    const side = getPlayerSide(anim, thisPlayerName);
    const amberRect = getStatRect('amber', side);

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

const ReapAnimation = ({ anim, onComplete }) => {
    return (
        <motion.div
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
};

registerAnimation(AnimationType.Reap, {
    component: ReapAnimation,
    resolver: resolveReapAnimation
});

export default ReapAnimation;
