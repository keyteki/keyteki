import React from 'react';
import Amber from './Amber';

import './Animations.scss';

const Animations = ({ animations, activePlayer }) => {
    return (
        <div className='animations'>
            {animations.map((animation, index) => {
                let animationName = animation;
                let animationDelay = 0;
                if (typeof animation == 'object') {
                    animationName = animation.name;
                    if (typeof animation.delay == 'number') {
                        animationDelay = animation.delay;
                    }
                }
                if (!activePlayer) {
                    animationName = animationName
                        .split('-')
                        .map((s) => (s == 'player' ? 'opponent' : s == 'opponent' ? 'player' : s))
                        .join('-');
                }
                return (
                    <Amber key={`a-${index}`} animation={animationName} delay={animationDelay} />
                );
            })}
        </div>
    );
};

export default Animations;
