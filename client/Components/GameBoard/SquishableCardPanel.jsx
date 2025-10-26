import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import Card from './Card';

import './SquishableCardPanel.scss';

const SquishableCardPanel = ({
    cards,
    cardSize = 'normal',
    className,
    groupVisibleCards,
    manualMode,
    maxCards,
    onCardClick,
    onMouseOut,
    onMouseOver,
    source,
    title,
    cardBack
}) => {
    const { i18n } = useTranslation();

    const getCardSizeMultiplier = useCallback(() => {
        switch (cardSize) {
            case 'small':
                return 0.6;
            case 'large':
                return 1.4;
            case 'x-large':
                return 2;
        }
        return 1;
    }, [cardSize]);

    const getCardDimensions = useCallback(() => {
        let multiplier = getCardSizeMultiplier();
        return {
            width: 65 * multiplier,
            height: 91 * multiplier
        };
    }, [getCardSizeMultiplier]);

    const getOverallDimensions = useCallback(() => {
        let cardDimensions = getCardDimensions();
        return {
            width: (cardDimensions.width + 7) * Math.min(maxCards, cards ? cards.length : 5),
            height: cardDimensions.height
        };
    }, [getCardDimensions, maxCards, cards]);

    const hasMixOfVisibleCards = useCallback(() => {
        return cards.some((card) => !!card.code) && cards.some((card) => !card.code);
    }, [cards]);

    const renderedCards = useMemo(() => {
        let overallDimensions = getOverallDimensions();
        let dimensions = getCardDimensions();

        let cardsToRender = cards;
        let cardIndex = 0;
        let handLength = cardsToRender ? cardsToRender.length : 0;
        let cardWidth = dimensions.width;

        let requiredWidth = handLength * cardWidth;
        let overflow = requiredWidth - overallDimensions.width;
        let offset = overflow / (handLength - 1);
        let needsSquish = cardsToRender && cardsToRender.length > maxCards;

        if (groupVisibleCards && hasMixOfVisibleCards()) {
            cardsToRender = [...cards].sort((a, b) => (a.facedown && !b.facedown ? -1 : 1));
        }

        let hand = cardsToRender.map((card) => {
            let left = (cardWidth - offset) * cardIndex++;

            let style = {};
            if (needsSquish) {
                style = {
                    left: left + 'px'
                };
            }

            return (
                <Card
                    key={card.uuid}
                    card={card}
                    cardBack={cardBack}
                    disableMouseOver={!card.name}
                    canDrag={manualMode}
                    onClick={onCardClick}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    size={cardSize}
                    style={style}
                    language={i18n.language}
                    source={source}
                />
            );
        });

        return hand;
    }, [
        cards,
        cardBack,
        cardSize,
        getCardDimensions,
        getOverallDimensions,
        groupVisibleCards,
        hasMixOfVisibleCards,
        i18n.language,
        manualMode,
        maxCards,
        onCardClick,
        onMouseOut,
        onMouseOver,
        source
    ]);

    const dimensions = getOverallDimensions();
    const needsSquish = cards && cards.length > maxCards;

    const panelClassName = classNames('squishable-card-panel', className, {
        [cardSize]: cardSize !== 'normal',
        squish: needsSquish
    });

    const style = {
        width: dimensions.width + 'px',
        height: dimensions.height + 'px'
    };

    return (
        <div className={panelClassName} style={style}>
            {title && <div className='panel-header'>{`${title} (${renderedCards.length})`}</div>}
            {renderedCards}
        </div>
    );
};

SquishableCardPanel.displayName = 'SquishableCardPanel';
SquishableCardPanel.propTypes = {
    cardBack: PropTypes.string,
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
