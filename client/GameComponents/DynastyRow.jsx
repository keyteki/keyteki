import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import $ from 'jquery';

import AdditionalCardPile from './AdditionalCardPile.jsx';
import Card from './Card.jsx';
import CardPile from './CardPile.jsx';
import Province from './Province.jsx';
import {tryParseJSON} from '../util.js';

class DynastyRow extends React.Component {
    constructor() {
        super();

        this.onConflictClick = this.onConflictClick.bind(this);
        this.onDynastyClick = this.onDynastyClick.bind(this);
        this.onConflictShuffleClick = this.onConflictShuffleClick.bind(this);
        this.onDynastyShuffleClick = this.onDynastyShuffleClick.bind(this);
        this.onShowConflictDeckClick = this.onShowConflictDeckClick.bind(this);
        this.onShowDynastyDeckClick = this.onShowDynastyDeckClick.bind(this);
        this.onConflictCloseClick = this.onConflictCloseClick.bind(this);
        this.onConflictCloseAndShuffleClick = this.onConflictCloseAndShuffleClick.bind(this);
        this.onDynastyCloseClick = this.onDynastyCloseClick.bind(this);
        this.onDynastyCloseAndShuffleClick = this.onDynastyCloseAndShuffleClick.bind(this);
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

    onConflictCloseClick() {
        if(this.props.onConflictClick) {
            this.props.onConflictClick();
        }
    }

    onConflictCloseAndShuffleClick() {
        if(this.props.onConflictClick) {
            this.props.onConflictClick();
        }

        if(this.props.onConflictShuffleClick) {
            this.props.onConflictShuffleClick();
        }
    }

    onDynastyCloseClick() {
        if(this.props.onDynastyClick) {
            this.props.onDynastyClick();
        }
    }

    onDynastyCloseAndShuffleClick() {
        if(this.props.onDynastyClick) {
            this.props.onDynastyClick();
        }

        if(this.props.onDynastyShuffleClick) {
            this.props.onDynastyShuffleClick();
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
                return (<Card key={ card.uuid } card={ card } source='conflict deck'
                    onMouseOver={ this.props.onMouseOver }
                    onMouseOut={ this.props.onMouseOut }
                    onClick={ this.props.onCardClick } />);
            });

            conflictDeckPopup = (
                <div className='popup panel' onClick={ event => event.stopPropagation() }>
                    <div>
                        <a onClick={ this.onConflictCloseClick }>Close</a>
                        <a onClick={ this.onConflictCloseAndShuffleClick }>Close and shuffle</a>
                    </div>
                    <div className='inner'>
                        { conflictDeck }
                    </div>
                </div>);
        }

        return conflictDeckPopup;
    }

    getDynastyDeck() {
        var dynastyDeckPopup = undefined;

        if(this.props.showDynastyDeck && this.props.dynastyDeck) {
            var dynastyDeck = _.map(this.props.dynastyDeck, card => {
                return (<Card key={ card.uuid } card={ card } source='dynasty deck'
                    onMouseOver={ this.props.onMouseOver }
                    onMouseOut={ this.props.onMouseOut }
                    onClick={ this.props.onCardClick } />);
            });

            dynastyDeckPopup = (
                <div className='popup panel' onClick={ event => event.stopPropagation() }>
                    <div>
                        <a onClick={ this.onDynastyCloseClick }>Close</a>
                        <a onClick={ this.onDynastyCloseAndShuffleClick }>Close and shuffle</a>
                    </div>
                    <div className='inner'>
                        { dynastyDeck }
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

    onConflictShuffleClick() {
        if(this.props.onConflictShuffleClick) {
            this.props.onConflictShuffleClick();
        }
    }

    onDynastyShuffleClick() {
        if(this.props.onDynastyShuffleClick) {
            this.props.onDynastyShuffleClick();
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
        var conflictDeckMenu = [
            { text: 'Show', handler: this.onShowConflictDeckClick, showPopup: true },
            { text: 'Shuffle', handler: this.onConflictShuffleClick}
        ];

        var dynastyDeckMenu = [
            { text: 'Show', handler: this.onShowDynastyDeckClick, showPopup: true },
            { text: 'Shuffle', handler: this.onDynastyShuffleClick}
        ];

        var conflictDeckPopupMenu = [
            { text: 'Close', handler: this.onConflictCloseClick},
            { text: 'Close and Shuffle', handler: this.onConflictCloseAndShuffleClick}
        ];

        var dynastyDeckPopupMenu = [
            { text: 'Close', handler: this.onDynastyCloseClick},
            { text: 'Close and Shuffle', handler: this.onDynastyCloseAndShuffleClick}
        ];

        if(this.props.isMe || this.props.spectating && !this.props.otherPlayer) {

            return (
                <div className='dynasty-row'>
                    <div className='deck-cards'>
                        <CardPile 
                            className='dynasty discard pile' 
                            title='Dynasty Discard' 
                            source='dynasty discard pile' 
                            cards={ this.props.dynastyDiscardPile }
                            onMouseOver={ this.props.onMouseOver } 
                            onMouseOut={ this.props.onMouseOut } 
                            onCardClick={ this.props.onCardClick }
                            popupLocation={ this.props.isMe || this.props.spectating ? 'top' : 'bottom' } 
                            onDragDrop={ this.props.onDragDrop } 
                            size={ this.props.cardSize } />
                        <CardPile 
                            className='dynasty draw' 
                            title='Dynasty' 
                            source='dynasty deck' 
                            cards={ this.props.dynastyDeck }
                            onMouseOver={ this.props.onMouseOver } 
                            onMouseOut={ this.props.onMouseOut } 
                            onCardClick={ this.props.onCardClick }
                            popupLocation='top'
                            disablePopup={ this.props.spectating || !this.props.isMe }
                            onDragDrop={ this.props.onDragDrop }
                            menu={ dynastyDeckMenu } 
                            hiddenTopCard cardCount={ this.props.numDynastyCards } 
                            popupMenu={ dynastyDeckPopupMenu } 
                            size={ this.props.cardSize } />

                        <Province isMe={ this.props.isMe } source='province 1' cards={ this.props.province1Cards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onDragDrop={ this.props.onDragDrop } onCardClick={ this.props.onCardClick } disablePopup size={ this.props.cardSize } onMenuItemClick={ this.props.onMenuItemClick } />
                        <Province isMe={ this.props.isMe } source='province 2' cards={ this.props.province2Cards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onDragDrop={ this.props.onDragDrop } onCardClick={ this.props.onCardClick } disablePopup size={ this.props.cardSize } onMenuItemClick={ this.props.onMenuItemClick } />
                        <Province isMe={ this.props.isMe } source='province 3' cards={ this.props.province3Cards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onDragDrop={ this.props.onDragDrop } onCardClick={ this.props.onCardClick } disablePopup size={ this.props.cardSize } onMenuItemClick={ this.props.onMenuItemClick } />
                        <Province isMe={ this.props.isMe } source='province 4' cards={ this.props.province4Cards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onDragDrop={ this.props.onDragDrop } onCardClick={ this.props.onCardClick } disablePopup size={ this.props.cardSize } onMenuItemClick={ this.props.onMenuItemClick } />

                        <CardPile 
                            className='conflict draw' 
                            title='Conflict' 
                            source='conflict deck' 
                            cards={ this.props.conflictDeck }
                            onMouseOver={ this.props.onMouseOver } 
                            onMouseOut={ this.props.onMouseOut } 
                            onCardClick={ this.props.onCardClick }
                            popupLocation='top'
                            disablePopup={ this.props.spectating || !this.props.isMe }
                            onDragDrop={ this.props.onDragDrop }
                            menu={ conflictDeckMenu } 
                            hiddenTopCard 
                            cardCount={ this.props.numConflictCards } 
                            popupMenu={ conflictDeckPopupMenu }
                            size={ this.props.cardSize } />
                        <CardPile 
                            className='conflict discard pile' 
                            title='Conflict Discard' 
                            source='conflict discard pile' 
                            cards={ this.props.conflictDiscardPile }
                            onMouseOver={ this.props.onMouseOver } 
                            onMouseOut={ this.props.onMouseOut } 
                            onCardClick={ this.props.onCardClick }
                            popupLocation={ this.props.isMe || this.props.spectating ? 'top' : 'bottom' } 
                            onDragDrop={ this.props.onDragDrop }
                            size={ this.props.cardSize } />
                    </div>
                </div>
            );
        }
        return (
            <div className='dynasty-row'>
                <div className='deck-cards'>
                    <CardPile 
                        className='conflict discard pile' 
                        title='Conflict Discard' 
                        source='conflict discard pile' 
                        cards={ this.props.conflictDiscardPile }
                        onMouseOver={ this.props.onMouseOver } 
                        onMouseOut={ this.props.onMouseOut } 
                        onCardClick={ this.props.onCardClick }
                        popupLocation={ this.props.isMe || this.props.spectating ? 'top' : 'bottom' } 
                        onDragDrop={ this.props.onDragDrop }
                        size={ this.props.cardSize } />
                    <CardPile 
                        className='conflict deck' 
                        title='Conflict' 
                        source='conflict deck' 
                        cards={ this.props.conflictDeck }
                        onMouseOver={ this.props.onMouseOver } 
                        onMouseOut={ this.props.onMouseOut } 
                        onCardClick={ this.props.onCardClick }
                        popupLocation='top'
                        disablePopup
                        onDragDrop={ this.props.onDragDrop }
                        menu={ conflictDeckMenu } 
                        hiddenTopCard 
                        cardCount={ this.props.numConflictCards } 
                        popupMenu={ conflictDeckPopupMenu }
                        size={ this.props.cardSize } />

                    <Province isMe={ this.props.isMe } source='province 4' cards={ this.props.province4Cards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick } disablePopup size={ this.props.cardSize } onMenuItemClick={ this.props.onMenuItemClick } />
                    <Province isMe={ this.props.isMe } source='province 3' cards={ this.props.province3Cards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick } disablePopup size={ this.props.cardSize } onMenuItemClick={ this.props.onMenuItemClick } />
                    <Province isMe={ this.props.isMe } source='province 2' cards={ this.props.province2Cards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick } disablePopup size={ this.props.cardSize } onMenuItemClick={ this.props.onMenuItemClick } />
                    <Province isMe={ this.props.isMe } source='province 1' cards={ this.props.province1Cards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick } disablePopup size={ this.props.cardSize } onMenuItemClick={ this.props.onMenuItemClick } />

                    <CardPile 
                        className='dynasty deck' 
                        title='Dynasty' source='dynasty deck' 
                        cards={ this.props.dynastyDeck }
                        onMouseOver={ this.props.onMouseOver } 
                        onMouseOut={ this.props.onMouseOut } 
                        onCardClick={ this.props.onCardClick }
                        popupLocation='top'
                        disablePopup
                        onDragDrop={ this.props.onDragDrop }
                        menu={ dynastyDeckMenu } 
                        hiddenTopCard 
                        cardCount={ this.props.numDynastyCards } 
                        popupMenu={ dynastyDeckPopupMenu }
                        size={ this.props.cardSize } />
                    <CardPile 
                        className='dynasty discard pile' 
                        title='Dynasty Discard' 
                        source='dynasty discard pile' 
                        cards={ this.props.dynastyDiscardPile }
                        onMouseOver={ this.props.onMouseOver } 
                        onMouseOut={ this.props.onMouseOut } 
                        onCardClick={ this.props.onCardClick }
                        popupLocation={ this.props.isMe || this.props.spectating ? 'top' : 'bottom' } 
                        onDragDrop={ this.props.onDragDrop }
                        size={ this.props.cardSize } />
                </div>
            </div>
        );

    }
}

DynastyRow.displayName = 'DynastyRow';
DynastyRow.propTypes = {
    additionalPiles: PropTypes.object,
    cardSize: PropTypes.string,
    conflictDeck: PropTypes.array,
    conflictDiscardPile: PropTypes.array,
    dynastyDeck: PropTypes.array,
    dynastyDiscardPile: PropTypes.array,
    hand: PropTypes.array,
    honor: PropTypes.number,
    isMe: PropTypes.bool,
    numConflictCards: PropTypes.number,
    numDynastyCards: PropTypes.number,
    onCardClick: PropTypes.func,
    onConflictClick: PropTypes.func,
    onConflictShuffleClick: PropTypes.func,
    onDiscardedCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onDynastyClick: PropTypes.func,
    onDynastyShuffleClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    province1Cards: PropTypes.array,
    province2Cards: PropTypes.array,
    province3Cards: PropTypes.array,
    province4Cards: PropTypes.array,
    provinceDeck: PropTypes.array,
    showConflictDeck: PropTypes.bool,
    showDynastyDeck: PropTypes.bool,
    spectating: PropTypes.bool
};

export default DynastyRow;
