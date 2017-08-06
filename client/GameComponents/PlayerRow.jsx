import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import AdditionalCardPile from './AdditionalCardPile.jsx';
import Card from './Card.jsx';
import CardCollection from './CardCollection.jsx';
import {tryParseJSON} from '../util.js';

class PlayerRow extends React.Component {
    constructor() {
        super();

        this.onDragDrop = this.onDragDrop.bind(this);

    }

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

        var card = event.dataTransfer.getData('Text');

        if(!card) {
            return;
        }

        var dragData = tryParseJSON(card);
        if(!dragData) {
            return;
        }

        if(this.props.onDragDrop) {
            this.props.onDragDrop(dragData.card, dragData.source, target);
        }
    }

    getHand(needsSquish) {
        var cardIndex = 0;
        var handLength = this.props.hand ? this.props.hand.length : 0;
        var requiredWidth = handLength * 64;
        var overflow = requiredWidth - 342;
        var offset = overflow / (handLength - 1);

        var hand = _.map(this.props.hand, card => {
            var left = (64 - offset) * cardIndex++;

            var style = {};
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

    getAdditionalPiles() {
        var piles = _.reject(this.props.additionalPiles, pile => pile.cards.length === 0 || pile.area !== 'player row');
        var index = 0;
        return _.map(piles, pile => {
            return (
                <AdditionalCardPile key={ 'additional-pile-' + index++ }
                    className='additional-cards'
                    isMe={ this.props.isMe } 
                    onMouseOut={ this.props.onMouseOut }
                    onMouseOver={ this.props.onMouseOver }
                    pile={ pile }
                    spectating={ this.props.spectating } />
            );
        });
    }

    render() {
        var className = 'panel hand';
        var needsSquish = this.props.hand && this.props.hand.length * 64 > 342;

        if(needsSquish) {
            className += ' squish';
        }

        var hand = this.getHand(needsSquish);

        var additionalPiles = this.getAdditionalPiles();

        var drawDeckMenu = [
            { text: 'Show', handler: this.onShowDeckClick, showPopup: true },
            { text: 'Shuffle', handler: this.onShuffleClick}
        ];

        var drawDeckPopupMenu = [
            { text: 'Close', handler: this.onCloseClick},
            { text: 'Close and Shuffle', handler: this.onCloseAndShuffleClick}
        ];

        return (
            <div className='player-home-row'>
                <div className='deck-cards'>
                    <div className={ className } onDragLeave={ this.onDragLeave } onDragOver={ this.onDragOver } onDrop={ (event) => this.onDragDrop(event, 'hand') }>
                        <div className='panel-header'>
                            { 'Hand (' + hand.length + ')' }
                        </div>
                        { hand }
                    </div>

                  { additionalPiles }
                </div>
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    additionalPiles: React.PropTypes.object,
    hand: React.PropTypes.array,
    isMe: React.PropTypes.bool,
    onDragDrop: React.PropTypes.func,
    onMenuItemClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    provinceDeck: React.PropTypes.array,
    honor: React.PropTypes.number,
    spectating: React.PropTypes.bool
};

export default PlayerRow;
