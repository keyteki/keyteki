import React from 'react';

import CardImage from './CardImage';

import './CardZoom.scss';

const CardZoom = ({ card, cardName }) => {
    if (!card) {
        return null;
    }

    const size = card.canvasRef ? 'x-large' : 'normal';

    return (
        <div className={`card-zoom ${size} vertical`}>
            {card.canvasRef ? (
                <canvas
                    className={`image-zoom ${size} img-fluid h-100 w-100`}
                    ref={card.canvasRef}
                />
            ) : (
                <div className='card-zoomed shadow'>
                    <span className='card-name'>{cardName}</span>
                    <CardImage card={card} />
                </div>
            )}
        </div>
    );
};

CardZoom.displayName = 'CardZoom';

export default CardZoom;
