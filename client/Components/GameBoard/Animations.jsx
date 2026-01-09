import React from 'react';
import Amber from './Amber';

import './Animations.scss';

const Animations = ({ animations = [] }) => {
    return (
        <div className='animations'>
            {animations.map((animation) => {
                let animationName = animation;
                let animationDelay = 0;
                if (typeof animation == 'object') {
                    animationName = animation.name;
                    if (typeof animation.delay == 'number') {
                        animationDelay = animation.delay;
                    }
                }
                return (
                    <Amber
                        key={`a-${animation.id}`}
                        animation={animationName}
                        delay={animationDelay}
                    />
                );
            })}
        </div>
    );
};

export default Animations;
