import React from 'react';
import moment from 'moment';

class DeckRow extends React.Component {
    render() {
        return (
            <div className={ this.props.active ? 'deck-row active' : 'deck-row' } key={ this.props.deck.name } onClick={ this.props.onClick }>
                <img className='pull-left' src={ '/img/mons/' + this.props.deck.faction.value + '.png' } />
                <div>{ this.props.deck.name }<span className='pull-right'>{ this.props.deck.validation.status }</span></div>
                <div>{ this.props.deck.faction.name }
                    { this.props.deck.allianceFaction && this.props.deck.allianceFaction.value !== 'none' ? <span>/{ this.props.deck.allianceFaction.name }</span> : null }
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
