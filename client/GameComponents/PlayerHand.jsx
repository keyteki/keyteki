import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import $ from 'jquery';

import Card from './Card.jsx';
import { tryParseJSON } from '../util.js';

class PlayerHand extends React.Component {
    onDragOver(event) {
        $(event.target).addClass('highlight-panel');
        event.preventDefault();
    }

    onDragLeave(event) {
        $(event.target).removeClass('highlight-panel');
    }

    onDragDrop(event, target) {
        event.stopPropagation();
        event.preventDefault();

        $(event.target).removeClass('highlight-panel');

        let card = event.dataTransfer.getData('Text');

        if(!card) {
            return;
        }

        let dragData = tryParseJSON(card);
        if(!dragData) {
            return;
        }

        if(this.props.onDragDrop) {
            this.props.onDragDrop(dragData.card, dragData.source, target);
        }
    }

    getCards(needsSquish) {
        let cardIndex = 0;
        let handLength = this.props.cards ? this.props.cards.length : 0;
        let cardWidth = this.getCardWidth();

        let requiredWidth = handLength * cardWidth;
        let overflow = requiredWidth - (cardWidth * 5);
        let offset = overflow / (handLength - 1);

        let hand = _.map(this.props.cards, card => {
            let left = (cardWidth - offset) * cardIndex++;

            let style = {};
            if(needsSquish) {
                style = {
                    left: left + 'px'
                };
            }

            return (<Card key={ card.uuid } card={ card } style={ style } disableMouseOver={ !this.props.isMe } source='hand'
                onMouseOver={ this.props.onMouseOver }
                onMouseOut={ this.props.onMouseOut }
                onClick={ this.props.onCardClick }
                onDragDrop={ this.props.onDragDrop }
                size={ this.props.cardSize } />);
        });

        return hand;
    }

    getCardWidth() {
        switch(this.props.cardSize) {
            case 'small':
                return 65 * 0.8;
            case 'large':
                return 65 * 1.4;
            case 'x-large':
                return 65 * 2;
            case 'normal':
            default:
                return 65;
        }
    }

    render() {
        let className = 'panel hand';

        if(this.props.cardSize !== 'normal') {
            className += ' ' + this.props.cardSize;
        }

        let cardWidth = this.getCardWidth();

        let needsSquish = this.props.cards && this.props.cards.length * cardWidth > (cardWidth * 5);

        if(needsSquish) {
            className += ' squish';
        }

        let cards = this.getCards(needsSquish);

        return (
            <div className={ className }
                onDragLeave={ this.onDragLeave }
                onDragOver={ this.onDragOver }
                onDrop={ event => this.onDragDrop(event, 'hand') }>
                <div className='panel-header'>
                    { 'Hand (' + cards.length + ')' }
                </div>
                { cards }
            </div>
        );
    }
}

PlayerHand.displayName = 'PlayerHand';
PlayerHand.propTypes = {
    cardSize: PropTypes.string,
    cards: PropTypes.array,
    isMe: PropTypes.bool,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func
};

export default PlayerHand;
