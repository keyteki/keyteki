import React from 'react';

import AdditionalCardPile from './AdditionalCardPile.jsx';
import PlayerHand from './PlayerHand.jsx';

class PlayerRow extends React.Component {
    constructor() {
        super();


    }

    getOutOfGamePile() {
        let pile = this.props.additionalPiles['out of game'];

        if(!pile || pile.cards.length === 0) {
            return;
        }

        return (
            <AdditionalCardPile
                className='additional-cards'
                isMe={ this.props.isMe }
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                pile={ pile }
                spectating={ this.props.spectating }
                title='Out of Game' />
        );
    }

    render() {
        return (
            <div className='player-home-row'>
                <div className='deck-cards'>
                    <PlayerHand
                        cards={ this.props.hand }
                        isMe={ this.props.isMe }
                        onCardClick={ this.props.onCardClick }
                        onDragDrop={ this.props.onDragDrop }
                        onMouseOut={ this.props.onMouseOut }
                        onMouseOver={ this.props.onMouseOver } />

                    { this.getOutOfGamePile() }
                </div>
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    additionalPiles: React.PropTypes.object,
    hand: React.PropTypes.array,
    honor: React.PropTypes.number,
    isMe: React.PropTypes.bool,
    onCardClick: React.PropTypes.func,
    onDragDrop: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    provinceDeck: React.PropTypes.array,
    spectating: React.PropTypes.bool
};

export default PlayerRow;
