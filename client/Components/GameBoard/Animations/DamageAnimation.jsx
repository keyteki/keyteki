import React from 'react';
import { motion } from 'motion/react';
import { DAMAGE_DURATION, FIGHT_DURATION } from './constants';
import damageToken from '../../../assets/img/damage.png';

const FIGHT_DELAY = FIGHT_DURATION * 0.4;

const ShieldIcon = () => (
    <svg viewBox='0 0 32 32' className='damage-shield-icon'>
        <path
            d='M16 3 L28 8 L28 16 C28 24 16 30 16 30 C16 30 4 24 4 16 L4 8 Z'
            fill='#888'
            stroke='#666'
            strokeWidth='1.5'
        />
    </svg>
);

const DamageAnimation = ({ anim, onComplete }) => {
    const delay = anim.fromFight ? FIGHT_DELAY : 0;
    const isAbsorbed = anim.amount === 0 && anim.armorUsed > 0;

    return (
        <motion.div
            className='damage-animation'
            style={{ left: anim.x, top: anim.y }}
            initial={{ opacity: 0, scale: 0.3, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.4, 1, 1], y: [0, 0, 0, -20] }}
            transition={{
                delay,
                duration: DAMAGE_DURATION,
                times: [0, 0.2, 0.6, 1],
                ease: 'easeOut'
            }}
            onAnimationComplete={onComplete}
        >
            {isAbsorbed ? (
                <ShieldIcon />
            ) : (
                <div className='damage-token-wrapper'>
                    <img src={damageToken} alt='' className='damage-token-icon' />
                    <span className='damage-token-number'>{anim.amount}</span>
                </div>
            )}
        </motion.div>
    );
};

export default DamageAnimation;
