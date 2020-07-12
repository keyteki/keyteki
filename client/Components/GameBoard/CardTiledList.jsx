import React from 'react';
import PropTypes from 'prop-types';

import Card from './Card';

import './CardTiledList.scss';

function CardTiledList(props) {
    let cardList =
        props.cards &&
        props.cards.map((card, index) => {
            return (
                <Card
                    cardBackUrl={props.cardBackUrl}
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
            {title && <div className='card-list-title'>{title}</div>}
            <div className='card-list-cards'>{cardList}</div>
        </div>
    );
}

CardTiledList.propTypes = {
    cardBackUrl: PropTypes.string,
    cards: PropTypes.array,
    disableMouseOver: PropTypes.bool,
    manualMode: PropTypes.bool,
    onCardClick: PropTypes.func,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    onTouchMove: PropTypes.func,
    size: PropTypes.string,
    source: PropTypes.string,
    title: PropTypes.string,
    titleCount: PropTypes.number
};

export default CardTiledList;
