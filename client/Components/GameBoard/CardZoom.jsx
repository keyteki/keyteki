import React from 'react';

import CardImage from './CardImage';

import './CardZoom.scss';

const CardZoom = ({ card, cardName }) => {
    if (!card) {
        return null;
    }

    const size = card.type === 'decklist' ? 'x-large' : 'normal';

    return (
        <div className={`card-zoom ${size} vertical`}>
            {
                <div className='card-zoomed shadow'>
                    {card.imageUrl ? (
                        <div className='card-zoomed shadow'>
                            <img className={`image-zoom ${size} img-fluid`} src={card.imageUrl} />
                        </div>
                    ) : (
                        <div className='card-zoomed shadow'>
                            <span className='card-name'>{cardName}</span>
                            <CardImage card={card} />
                        </div>
                    )}
                </div>
            }
        </div>
    );
};

CardZoom.displayName = 'CardZoom';

export default CardZoom;
