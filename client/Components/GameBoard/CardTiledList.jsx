import React from 'react';
import PropTypes from 'prop-types';

import Card from './Card';

function CardTiledList(props) {
    let cardList =
        props.cards &&
        props.cards.map((card, index) => {
            return (
                <Card
                    cardBack={props.cardBack}
                    canDrag={props.manualMode}
                    card={card}
                    disableMouseOver={props.disableMouseOver}
                    key={index}
                    onClick={props.onCardClick}
                    onMouseOut={props.onCardMouseOut}
                    onMouseOver={props.onCardMouseOver}
                    onTouchMove={props.onTouchMove}
                    orientation='vertical'
                    size={props.size}
                    hasActiveHouse={props.hasActiveHouse}
                    isMe={props.isMe}
                    isSpectating={props.isSpectating}
                    source={props.source}
                />
            );
        });

    let title =
        props.title && props.cards
            ? `${props.title} (${props.titleCount || props.cards.length})`
            : props.title;

    return (
        <div className='card-list'>
            {title && <div className='mb-1 bg-black/60 text-center text-white'>{title}</div>}
            <div className='flex flex-wrap content-start items-start justify-start'>{cardList}</div>
        </div>
    );
}

CardTiledList.propTypes = {
    cards: PropTypes.array,
    disableMouseOver: PropTypes.bool,
    manualMode: PropTypes.bool,
    onCardClick: PropTypes.func,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    onTouchMove: PropTypes.func,
    hasActiveHouse: PropTypes.bool,
    isMe: PropTypes.bool,
    isSpectating: PropTypes.bool,
    size: PropTypes.string,
    source: PropTypes.string,
    title: PropTypes.string,
    titleCount: PropTypes.number
};

export default CardTiledList;
