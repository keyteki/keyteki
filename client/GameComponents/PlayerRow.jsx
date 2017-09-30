import React from 'react';
import PropTypes from 'prop-types';

import HonorFan from './HonorFan.jsx';
import PlayerHand from './PlayerHand.jsx';

class PlayerRow extends React.Component {
    constructor() {
        super();

    }

    /*
    getOutOfGamePile() {
        let pile = this.props.outOfGamePile;

        if(pile.length === 0) {
            return;
        }

        return (
            <CardPile
                cards={ pile }
                className='additional-cards'
                onCardClick={ this.props.onCardClick }
                onDragDrop={ this.props.onDragDrop }
                onMenuItemClick={ this.props.onMenuItemClick }
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                orientation='bowed'
                popupLocation={ this.props.isMe || this.props.spectating ? 'top' : 'bottom' }
                source='out of game'
                title='Out of Game'
                size={ this.props.cardSize } />
        );
    }
*/
    render() {
        
        return (
            <div className='player-home-row-container'>
                <PlayerHand
                    cards={ this.props.hand }
                    isMe={ this.props.isMe }
                    onCardClick={ this.props.onCardClick }
                    onDragDrop={ this.props.onDragDrop }
                    onMouseOut={ this.props.onMouseOut }
                    onMouseOver={ this.props.onMouseOver }
                    cardSize={ this.props.cardSize } />
                <HonorFan value={ this.props.showBid } />
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    cardSize: PropTypes.string,
    hand: PropTypes.array,
    honor: PropTypes.number,
    isMe: PropTypes.bool,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    /* outOfGamePile: PropTypes.array, */
    provinceDeck: PropTypes.array,
    showBid: PropTypes.number,
    spectating: PropTypes.bool,
    title: PropTypes.object
};

export default PlayerRow;
