import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import Card from './Card.jsx';
import {tryParseJSON} from '../util.js';

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
        let requiredWidth = handLength * 64;
        let overflow = requiredWidth - 342;
        let offset = overflow / (handLength - 1);

        let hand = _.map(this.props.cards, card => {
            let left = (64 - offset) * cardIndex++;

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
                onDragDrop={ this.props.onDragDrop } />);
        });

        return hand;
    }


    render() {
        let className = 'panel hand';
        let needsSquish = this.props.cards && this.props.cards.length * 64 > 342;

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
    cards: React.PropTypes.array,
    isMe: React.PropTypes.bool,
    onCardClick: React.PropTypes.func,
    onDragDrop: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func
};

export default PlayerHand;
