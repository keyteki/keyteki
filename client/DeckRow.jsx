import React from 'react';
import moment from 'moment';

import {validateDeck} from './deck-validator';

class DeckRow extends React.Component {
    render() {
        var validation = validateDeck(this.props.deck);

        return (
            <div className={ this.props.active ? 'deck-row active' : 'deck-row' } key={ this.props.deck.name } onClick={ this.props.onClick }>
                <img className='pull-left' src={ '/img/factions/' + this.props.deck.faction.value + '.png' } />
                <div>{ this.props.deck.name }<span className='pull-right'>{ validation.status === 'Valid' ? 'Valid' : 'Invalid' }</span></div>
                <div>{ this.props.deck.faction.name }
                    { this.props.deck.agenda && this.props.deck.agenda.label ? <span>/{ this.props.deck.agenda.label }</span> : null }
                    <span className='pull-right'>{ moment(this.props.deck.lastUpdated).format('Do MMMM YYYY') }</span>
                </div>
            </div>);
    }
}

DeckRow.displayName = 'DeckRow';
DeckRow.propTypes = {
    active: React.PropTypes.bool,
    deck: React.PropTypes.object,
    onClick: React.PropTypes.func
};

export default DeckRow;
