import React from 'react';
import classNames from 'classnames';
import './IdentityCard.scss';
import IdentityCardImage from '../Decks/IdentityCardImage';

const IdentityCard = ({ className, deck, size, onMouseOut, onMouseOver }) => {
    let fullClass = classNames('panel', 'card-pile', className, {
        size: size !== 'normal'
    });

    let image = <IdentityCardImage deck={deck} size={size} />;

    return (
        <div
            className={fullClass}
            onMouseOver={() =>
                onMouseOver({
                    image: <IdentityCardImage deck={deck} />,
                    size: 'x-large'
                })
            }
            onMouseOut={onMouseOut}
        >
            <div className='card-wrapper'>
                <div className='card-frame'>
                    <div className={`game-card vertical ${size}`}>{image}</div>
                </div>
            </div>
        </div>
    );
};

IdentityCard.displayName = 'IdentityCard';

export default IdentityCard;
