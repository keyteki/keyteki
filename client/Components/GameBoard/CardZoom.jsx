import React from 'react';

const CardZoom = ({ card }) => {
    return <div className={`card-zoom ${card.size} ${card.orientation} shadow`}>{card.image}</div>;
};

CardZoom.displayName = 'CardZoom';

export default CardZoom;
