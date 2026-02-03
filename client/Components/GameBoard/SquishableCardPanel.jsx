import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import Card from './Card';

import './SquishableCardPanel.scss';

const SquishableCardPanel = (props) => {
    const { i18n } = useTranslation();
    const cards = props.cards || [];

    const cardSizeMultiplier = useMemo(() => {
        switch (props.cardSize) {
            case 'small':
                return 0.6;
            case 'large':
                return 1.4;
            case 'x-large':
                return 2;
            default:
                return 1;
        }
    }, [props.cardSize]);

    const cardDimensions = useMemo(
        () => ({
            width: 65 * cardSizeMultiplier,
            height: 91 * cardSizeMultiplier
        }),
        [cardSizeMultiplier]
    );

    const overallDimensions = useMemo(
        () => ({
            width: (cardDimensions.width + 7) * Math.min(props.maxCards, cards.length || 5),
            height: cardDimensions.height
        }),
        [cardDimensions.height, cardDimensions.width, cards.length, props.maxCards]
    );

    const needsSquish = cards.length > props.maxCards;
    const hasMixOfVisibleCards =
        cards.some((card) => !!card.code) && cards.some((card) => !card.code);
    const sortedCards =
        props.groupVisibleCards && hasMixOfVisibleCards
            ? [...cards].sort((a, b) => (a.facedown && !b.facedown ? -1 : 1))
            : cards;

    let cardIndex = 0;
    const requiredWidth = cards.length * cardDimensions.width;
    const overflow = requiredWidth - overallDimensions.width;
    const offset = overflow / (cards.length - 1 || 1);

    const renderedCards = sortedCards.map((card) => {
        const left = (cardDimensions.width - offset) * cardIndex++;
        const style = needsSquish ? { left: `${left}px` } : {};

        return (
            <Card
                key={card.uuid}
                card={card}
                cardBack={props.cardBack}
                disableMouseOver={!card.name}
                canDrag={props.manualMode}
                onClick={props.onCardClick}
                onMouseOver={props.onMouseOver}
                onMouseOut={props.onMouseOut}
                size={props.cardSize}
                style={style}
                language={i18n.language}
                source={props.source}
            />
        );
    });

    const className = classNames('squishable-card-panel', props.className, {
        [props.cardSize]: props.cardSize !== 'normal',
        squish: needsSquish
    });

    const style = {
        width: `${overallDimensions.width}px`,
        height: `${overallDimensions.height}px`
    };

    return (
        <div className={className} style={style}>
            {props.title && (
                <div className='panel-header'>{`${props.title} (${renderedCards.length})`}</div>
            )}
            {renderedCards}
        </div>
    );
};

SquishableCardPanel.displayName = 'SquishableCardPanel';
SquishableCardPanel.propTypes = {
    cardSize: PropTypes.string,
    cards: PropTypes.array,
    className: PropTypes.string,
    groupVisibleCards: PropTypes.bool,
    manualMode: PropTypes.bool,
    maxCards: PropTypes.number,
    onCardClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    source: PropTypes.string,
    title: PropTypes.string
};

export default SquishableCardPanel;
