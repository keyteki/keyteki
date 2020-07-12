import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withTranslation } from 'react-i18next';

import Card from './Card';

import './SquishableCardPanel.scss';

class SquishableCardPanel extends React.Component {
    getCards(needsSquish) {
        let overallDimensions = this.getOverallDimensions();
        let dimensions = this.getCardDimensions();

        let cards = this.props.cards;
        let cardIndex = 0;
        let handLength = cards ? cards.length : 0;
        let cardWidth = dimensions.width;

        let requiredWidth = handLength * cardWidth;
        let overflow = requiredWidth - overallDimensions.width;
        let offset = overflow / (handLength - 1);

        if (this.props.groupVisibleCards && this.hasMixOfVisibleCards()) {
            cards = [...this.props.cards].sort((a, b) => (a.facedown && !b.facedown ? -1 : 1));
        }

        let hand = cards.map((card) => {
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
                    cardBackUrl={this.props.cardBackUrl}
                    disableMouseOver={!card.name}
                    canDrag={this.props.manualMode}
                    onClick={this.props.onCardClick}
                    onMouseOver={this.props.onMouseOver}
                    onMouseOut={this.props.onMouseOut}
                    size={this.props.cardSize}
                    style={style}
                    language={this.props.i18n.language}
                    source={this.props.source}
                />
            );
        });

        return hand;
    }

    hasMixOfVisibleCards() {
        return (
            this.props.cards.some((card) => !!card.code) &&
            this.props.cards.some((card) => !card.code)
        );
    }

    getCardDimensions() {
        let multiplier = this.getCardSizeMultiplier();
        return {
            width: 65 * multiplier,
            height: 91 * multiplier
        };
    }

    getCardSizeMultiplier() {
        switch (this.props.cardSize) {
            case 'small':
                return 0.6;
            case 'large':
                return 1.4;
            case 'x-large':
                return 2;
        }

        return 1;
    }

    getOverallDimensions() {
        let cardDimensions = this.getCardDimensions();
        return {
            width: (cardDimensions.width + 5) * this.props.maxCards,
            height: cardDimensions.height
        };
    }

    render() {
        let dimensions = this.getOverallDimensions();
        let maxCards = this.props.maxCards;
        let needsSquish = this.props.cards && this.props.cards.length > maxCards;
        let cards = this.getCards(needsSquish, maxCards);

        let className = classNames('squishable-card-panel', this.props.className, {
            [this.props.cardSize]: this.props.cardSize !== 'normal',
            squish: needsSquish
        });

        let style = {
            width: dimensions.width + 'px',
            height: dimensions.height + 'px'
        };

        return (
            <div className={className} style={style}>
                {this.props.title && (
                    <div className='panel-header'>{`${this.props.title} (${cards.length})`}</div>
                )}
                {cards}
            </div>
        );
    }
}

SquishableCardPanel.displayName = 'SquishableCardPanel';
SquishableCardPanel.propTypes = {
    cardBackUrl: PropTypes.string,
    cardSize: PropTypes.string,
    cards: PropTypes.array,
    className: PropTypes.string,
    groupVisibleCards: PropTypes.bool,
    i18n: PropTypes.object,
    manualMode: PropTypes.bool,
    maxCards: PropTypes.number,
    onCardClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    source: PropTypes.string,
    t: PropTypes.func,
    title: PropTypes.string,
    username: PropTypes.string
};

export default withTranslation()(SquishableCardPanel);
