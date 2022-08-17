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
                    if (animationName == 'player-to-opponent') {
                        animationName = 'opponent-to-player';
                    } else if (animationName == 'opponent-to-player') {
                        animationName = 'player-to-opponent';
                    } else if (animationName.includes('player')) {
                        animationName = animationName.replace('player', 'opponent');
                    } else if (animationName.includes('opponent')) {
                        animationName = animationName.replace('opponent', 'player');
                    }
                }
                return (
                    <Amber key={`a-${index}`} animation={animationName} delay={animationDelay} />
                );
            })}
        </div>
    );
};

export default Animations;
