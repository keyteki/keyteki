import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import AdditionalCardPile from './AdditionalCardPile.jsx';
import Card from './Card.jsx';
import CardCollection from './CardCollection.jsx';
import Province from './Province.jsx';
import {tryParseJSON} from '../util.js';

class DynastyRow extends React.Component {
    constructor() {
        super();

        this.onConflictClick = this.onConflictClick.bind(this);
        this.onDynastyClick = this.onDynastyClick.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);
        this.onShowConflictDeckClick = this.onShowConflictDeckClick.bind(this);
        this.onShowDynastyDeckClick = this.onShowDynastyDeckClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onCloseAndShuffleClick = this.onCloseAndShuffleClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);

        this.state = {
            showConflictMenu: false,
            showDynastyMenu: false
        };
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

    onCloseClick() {
        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }
    }

    onCloseAndShuffleClick() {
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

    getConflictDeck() {
        var conflictDeckPopup = undefined;

        if(this.props.showConflictDeck && this.props.conflictDeck) {
            var conflictDeck = _.map(this.props.conflictDeck, card => {
                return (<Card key={card.uuid} card={card} source='conflict deck'
                             onMouseOver={this.props.onMouseOver}
                             onMouseOut={this.props.onMouseOut}
                             onClick={this.props.onCardClick} />);
            });

            conflictDeckPopup = (
                <div className='popup panel' onClick={event => event.stopPropagation() }>
                    <div>
                        <a onClick={this.onCloseClick}>Close</a>
                        <a onClick={this.onCloseAndShuffleClick}>Close and shuffle</a>
                    </div>
                    <div className='inner'>
                        {conflictDeck}
                    </div>
                </div>);
        }

        return conflictDeckPopup;
    }

    getDynastyDeck() {
        var dynastyDeckPopup = undefined;

        if(this.props.showDynastyDeck && this.props.dynastyDeck) {
            var dynastyDeck = _.map(this.props.dynastyDeck, card => {
                return (<Card key={card.uuid} card={card} source='dynasty deck'
                             onMouseOver={this.props.onMouseOver}
                             onMouseOut={this.props.onMouseOut}
                             onClick={this.props.onCardClick} />);
            });

            dynastyDeckPopup = (
                <div className='popup panel' onClick={event => event.stopPropagation() }>
                    <div>
                        <a onClick={this.onCloseClick}>Close</a>
                        <a onClick={this.onCloseAndShuffleClick}>Close and shuffle</a>
                    </div>
                    <div className='inner'>
                        {dynastyDeck}
                    </div>
                </div>);
        }

        return dynastyDeckPopup;
    }

    onConflictClick() {
        this.setState({ showConflictMenu: !this.state.showConflictMenu });
    }

    onDynastyClick() {
        this.setState({ showDynastyMenu: !this.state.showDynastyMenu });
    }

    onShuffleClick() {
        if(this.props.onShuffleClick) {
            this.props.onShuffleClick();
        }
    }

    onShowConflictDeckClick() {
        if(this.props.onConflictClick) {
            this.props.onConflictClick();
        }
    }

    onShowDynastyDeckClick() {
        if(this.props.onDynastyClick) {
            this.props.onDynastyClick();
        }
    }

    getAdditionalPiles() {
        var piles = _.reject(this.props.additionalPiles, pile => pile.cards.length === 0 || pile.area !== 'player row');
        var index = 0;
        return _.map(piles, pile => {
            return (
                <AdditionalCardPile key={'additional-pile-' + index++}
                    className='additional-cards'
                    isMe={this.props.isMe}
                    onMouseOut={this.props.onMouseOut}
                    onMouseOver={this.props.onMouseOver}
                    pile={pile}
                    spectating={this.props.spectating} />
            );
        });
    }

    render() {
        var additionalPiles = this.getAdditionalPiles();

        var conflictDeckMenu = [
            { text: 'Show', handler: this.onShowConflictDeckClick, showPopup: true },
            { text: 'Shuffle', handler: this.onShuffleClick}
        ];

        var dynastyDeckMenu = [
            { text: 'Show', handler: this.onShowDynastyDeckClick, showPopup: true },
            { text: 'Shuffle', handler: this.onShuffleClick}
        ];

        var conflictDeckPopupMenu = [
            { text: 'Close', handler: this.onCloseClick},
            { text: 'Close and Shuffle', handler: this.onCloseAndShuffleClick}
        ];

        var dynastyDeckPopupMenu = [
            { text: 'Close', handler: this.onCloseClick},
            { text: 'Close and Shuffle', handler: this.onCloseAndShuffleClick}
        ];

        if(this.props.isMe) {

            return (
                <div className='dynasty-row'>
                    <div className='deck-cards'>
                        <CardCollection className='dynasty discard pile' title='Dynasty Discard' source='dynasty discard pile' cards={this.props.dynastyDiscardPile}
                                        onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onCardClick={this.props.onCardClick}
                                        popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'} onDragDrop={this.props.onDragDrop} />
                        <CardCollection className='dynasty deck' title='Dynasty' source='dynasty deck' cards={this.props.dynastyDeck}
                                        onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onCardClick={this.props.onCardClick}
                                        popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'} onDragDrop={this.props.onDragDrop}
                                        menu={dynastyDeckMenu} hiddenTopCard cardCount={this.props.numDynastyCards} popupMenu={dynastyDeckPopupMenu} />
                        {/* Add Provinces in here */}

                        <Province source='province 1' cards={this.props.province1Cards} onMouseOver={this.props.onMouseOver} onMouseOut={this.onMouseOut} onDragDrop={this.props.onDragDrop} hiddenProvinceCard='true' />
                        <Province source='province 2' cards={this.props.province2Cards} onMouseOver={this.props.onMouseOver} onMouseOut={this.onMouseOut} onDragDrop={this.props.onDragDrop} hiddenProvinceCard='true' />
                        <Province source='province 3' cards={this.props.province3Cards} onMouseOver={this.props.onMouseOver} onMouseOut={this.onMouseOut} onDragDrop={this.props.onDragDrop} hiddenProvinceCard='true' />
                        <Province source='province 4' cards={this.props.province4Cards} onMouseOver={this.props.onMouseOver} onMouseOut={this.onMouseOut} onDragDrop={this.props.onDragDrop} hiddenProvinceCard='true' />

                        <CardCollection className='conflict deck' title='Conflict' source='conflict deck' cards={this.props.conflictDeck}
                                        onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onCardClick={this.props.onCardClick}
                                        popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'} onDragDrop={this.props.onDragDrop}
                                        menu={conflictDeckMenu} hiddenTopCard cardCount={this.props.numConflictCards} popupMenu={conflictDeckPopupMenu} />
                        <CardCollection className='conflict discard pile' title='Conflict Discard' source='conflict discard pile' cards={this.props.conflictDiscardPile}
                                        onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onCardClick={this.props.onCardClick}
                                        popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'} onDragDrop={this.props.onDragDrop} />                    
                    </div>
                </div>
            );
        } else {
            return (
                <div className='dynasty-row'>
                    <div className='deck-cards'>
                        <CardCollection className='conflict discard pile' title='Conflict Discard' source='conflict discard pile' cards={this.props.conflictDiscardPile}
                                    onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onCardClick={this.props.onCardClick}
                                    popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'} onDragDrop={this.props.onDragDrop} />
                        <CardCollection className='conflict deck' title='Conflict' source='conflict deck' cards={this.props.conflictDeck}
                                    onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onCardClick={this.props.onCardClick}
                                    popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'} onDragDrop={this.props.onDragDrop}
                                    menu={conflictDeckMenu} hiddenTopCard cardCount={this.props.numConflictCards} popupMenu={conflictDeckPopupMenu} />
                        {/* Add Provinces in here */}
                        <Province source='province 4' cards={this.props.province4Cards} onMouseOver={this.props.onMouseOver} onMouseOut={this.onMouseOut} hiddenProvinceCard='true' />
                        <Province source='province 3' cards={this.props.province3Cards} onMouseOver={this.props.onMouseOver} onMouseOut={this.onMouseOut} hiddenProvinceCard='true' />
                        <Province source='province 2' cards={this.props.province2Cards} onMouseOver={this.props.onMouseOver} onMouseOut={this.onMouseOut} hiddenProvinceCard='true' />
                        <Province source='province 1' cards={this.props.province1Cards} onMouseOver={this.props.onMouseOver} onMouseOut={this.onMouseOut} hiddenProvinceCard='true' />
                    
                        <CardCollection className='dynasty deck' title='Dynasty' source='dynasty deck' cards={this.props.dynastyDeck}
                                    onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onCardClick={this.props.onCardClick}
                                    popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'} onDragDrop={this.props.onDragDrop}
                                    menu={dynastyDeckMenu} hiddenTopCard cardCount={this.props.numDynastyCards} popupMenu={dynastyDeckPopupMenu} />
                        <CardCollection className='dynasty discard pile' title='Dynasty Discard' source='dynasty discard pile' cards={this.props.dynastyDiscardPile}
                                    onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onCardClick={this.props.onCardClick}
                                    popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'} onDragDrop={this.props.onDragDrop} />
                    </div>
                </div>
            );            
        }
    }
}

DynastyRow.displayName = 'DynastyRow';
DynastyRow.propTypes = {
    additionalPiles: React.PropTypes.object,
    conflictDiscardPile: React.PropTypes.array,
    conflictDeck: React.PropTypes.array,
    dynastyDiscardPile: React.PropTypes.array,
    dynastyDeck: React.PropTypes.array,
    hand: React.PropTypes.array,
    isMe: React.PropTypes.bool,
    numConflictCards: React.PropTypes.number,
    numDynastyCards: React.PropTypes.number,
    onCardClick: React.PropTypes.func,
    onDiscardedCardClick: React.PropTypes.func,
    onDragDrop: React.PropTypes.func,
    onDrawClick: React.PropTypes.func,
    onMenuItemClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    onShuffleClick: React.PropTypes.func,
    provinceDeck: React.PropTypes.array,
    province1Cards: React.PropTypes.array,
    province2Cards: React.PropTypes.array,
    province3Cards: React.PropTypes.array,
    province4Cards: React.PropTypes.array,
    honor: React.PropTypes.number,
    showConflictDeck: React.PropTypes.bool,
    showDynastyDeck: React.PropTypes.bool,
    spectating: React.PropTypes.bool
};

export default DynastyRow;
