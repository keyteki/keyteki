import React from 'react';
import { motion } from 'motion/react';
import AmberImage from '../../../assets/img/amber.png';
import { ANIMATION_DURATION } from './constants';

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

export default ReapAnimation;
