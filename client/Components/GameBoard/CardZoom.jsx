import React from 'react';

import './CardZoom.scss';

const CardZoom = ({ card }) => {
    if (!card) {
        return null;
    }

    return <div className={`card-zoom ${card.size} vertical shadow`}>{card.image}</div>;
};

CardZoom.displayName = 'CardZoom';

export default CardZoom;
