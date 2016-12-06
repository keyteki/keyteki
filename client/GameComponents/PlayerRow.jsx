import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import Card from './Card.jsx';
import CardCollection from './CardCollection.jsx';

class PlayerRow extends React.Component {
    constructor() {
        super();

        this.onDrawClick = this.onDrawClick.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);
        this.onShowDeckClick = this.onShowDeckClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onCloseAndShuffleClick = this.onCloseAndShuffleClick.bind(this);
        this.onAgendaClick = this.onAgendaClick.bind(this);

        this.state = {
            showDrawMenu: false
        };
    }

    onCloseClick(event) {
        event.preventDefault();
        event.stopPropagation();

        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }
    }

    onCloseAndShuffleClick(event) {
        event.preventDefault();
        event.stopPropagation();

        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }

        if(this.props.onShuffleClick) {
            this.props.onShuffleClick();
        }
    }

    onDiscardedCardClick(event, cardId) {
        event.preventDefault();
        event.stopPropagation();

        if(this.props.onDiscardedCardClick) {
            this.props.onDiscardedCardClick(cardId);
        }
    }

    getHand() {
        var cardIndex = 0;
        var handLength = this.props.hand ? this.props.hand.length : 0;
        var requiredWidth = handLength * 64;
        var overflow = requiredWidth - 342;
        var offset = overflow / (handLength - 1);

        var hand = _.map(this.props.hand, card => {
            var left = (64 - offset) * cardIndex++;

            var style = {
                left: left + 'px'
            };

            return (<Card key={card.uuid} card={card} style={style} disableMouseOver={!this.props.isMe} source='hand' 
                         onMouseOver={this.props.onMouseOver}
                         onMouseOut={this.props.onMouseOut}
                         onClick={this.props.onCardClick} />);
        });

        return hand;
    }

    getDrawDeck() {
        var drawDeckPopup = undefined;

        if(this.props.showDrawDeck && this.props.drawDeck) {
            var drawDeck = _.map(this.props.drawDeck, card => {
                return (<Card key={card.uuid} card={card} source='draw deck'
                             onMouseOver={this.props.onMouseOver}
                             onMouseOut={this.props.onMouseOut}
                             onClick={this.props.onCardClick} />);
            });

            drawDeckPopup = (
                <div className='popup panel' onClick={event => event.stopPropagation() }>
                    <div>
                        <a onClick={this.onCloseClick}>Close</a>
                        <a onClick={this.onCloseAndShuffleClick}>Close and shuffle</a>
                    </div>
                    <div className='inner'>
                        {drawDeck}
                    </div>
                </div>);
        }

        return drawDeckPopup;
    }

    onDrawClick(event) {
        event.preventDefault();

        this.setState({ showDrawMenu: !this.state.showDrawMenu });
    }

    onAgendaClick(event) {
        event.preventDefault();

        this.setState({ showAgendaMenu: !this.state.showAgendaMenu });
    }

    onShuffleClick(event) {
        event.preventDefault();

        if(this.props.onShuffleClick) {
            this.props.onShuffleClick();
        }
    }

    onShowDeckClick(event) {
        event.preventDefault();

        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }
    }

    cardMenuClick(card, menuItem) {
        if(this.props.onCardMenuClick) {
            this.props.onCardMenuClick(card, menuItem);
        }

        this.setState({ showAgendaMenu: false });
    }

    render() {
        var className = 'panel hand';

        if(this.props.hand && this.props.hand.length * 64 > 342) {
            className += ' squish';
        }

        var hand = this.getHand();
        var drawDeckPopup = this.getDrawDeck();

        var powerCounters = this.props.power > 0 ? (
            <div className='counters ignore-mouse-events'>
                <div className='counter power'>
                    {this.props.power}
                </div>
            </div>) : null;

        var drawDeckMenu = this.state.showDrawMenu ?
            (<div className='panel menu'>
                <div onClick={this.onShowDeckClick}>Show</div>
                <div onClick={this.onShuffleClick}>Shuffle</div>
            </div>)
            : null;

        var menuIndex = 0;
        var agendaMenuItems = this.props.agenda && this.props.agenda.menu && this.state.showAgendaMenu ? _.map(this.props.agenda.menu, menuItem => {
            return <div key={menuIndex++} onClick={this.cardMenuClick.bind(this, this.props.agenda, menuItem)}>{menuItem.text}</div>;
        }) : null;

        var agendaMenu = agendaMenuItems ? (
            <div className='panel menu'>
                {agendaMenuItems}
            </div>
        ) : null;        

        return (
            <div className='player-home-row'>
                <div className={className} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={(event) => this.onDragDrop(event, 'hand')}>
                    <div className='panel-header'>
                        {'Hand (' + hand.length + ')'}
                    </div>
                    {hand}
                </div>
                <CardCollection className='discard' title='Discard' source='discard pile' cards={this.props.discardPile} 
                                popupLocation={this.props.isMe ? 'top' : 'bottom'}
                                onDragDrop={this.props.onDragDrop} />

                <div className='draw panel' onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={(event) => this.onDragDrop(event, 'draw deck')}
                    onClick={this.props.isMe ? this.onDrawClick : null}>
                    <div className='panel-header'>
                        {'Draw (' + this.props.numDrawCards + ')'}
                    </div>
                    <div className='card ignore-mouse-events'>
                        <img className='card' src='/img/cards/cardback.jpg' />
                    </div>
                    {drawDeckMenu}
                    {drawDeckPopup}
                </div>
                <div className={'faction panel' + (this.props.faction && this.props.faction.kneeled ? ' kneeled horizontal-card' : '')}>
                    <div>
                        {this.props.faction ? <img
                            className={'card' + (this.props.faction && this.props.faction.kneeled ? ' kneeled vertical' : '')}
                            src={'/img/factions/' + this.props.faction.code + '.png'} /> : null}
                    </div>
                    {powerCounters}
                </div>
                {this.props.agenda && this.props.agenda.code !== '' ?
                    <div className='agenda panel'
                        onMouseOver={this.props.onMouseOver ? this.props.onMouseOver.bind(this, this.props.agenda) : null}
                        onMouseOut={this.props.onMouseOut ? this.props.onMouseOut : null}
                        onClick={this.onAgendaClick}>
                        <div className='card'>
                            <img className='card' src={'/img/cards/' + this.props.agenda.code + '.png'} />
                        </div>    
                        {agendaMenu}
                    </div>
                    : <div className='agenda panel' />
                }
                <CardCollection className='dead' title='Dead' source='dead pile' cards={this.props.deadPile} 
                                popupLocation={this.props.isMe ? 'top' : 'bottom'}
                                onDragDrop={this.props.onDragDrop} orientation='horizontal' />
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    agenda: React.PropTypes.object,
    deadPile: React.PropTypes.array,
    discardPile: React.PropTypes.array,
    drawDeck: React.PropTypes.array,
    faction: React.PropTypes.object,
    hand: React.PropTypes.array,
    isMe: React.PropTypes.bool,
    numDrawCards: React.PropTypes.number,
    onCardClick: React.PropTypes.func,
    onCardMenuClick: React.PropTypes.func,
    onDiscardedCardClick: React.PropTypes.func,
    onDragDrop: React.PropTypes.func,
    onDrawClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    onShuffleClick: React.PropTypes.func,
    plotDeck: React.PropTypes.array,
    power: React.PropTypes.number,
    showDrawDeck: React.PropTypes.bool,
    spectating: React.PropTypes.bool
};

export default PlayerRow;
