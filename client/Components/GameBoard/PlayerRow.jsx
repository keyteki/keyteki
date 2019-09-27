import React from 'react';
import PropTypes from 'prop-types';

import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import DrawDeck from './DrawDeck';
import IdentityCard from './IdentityCard';
import Droppable from './Droppable';

import { withTranslation } from 'react-i18next';

class PlayerRow extends React.Component {

    renderDroppablePile(source, child) {
        return this.props.isMe ? <Droppable onDragDrop={ this.props.onDragDrop } source={ source } manualMode={ this.props.manualMode }>{ child }</Droppable> : child;
    }

    renderKeys() {
        let t = this.props.t;

        let keys = [];

        for(let i = 0; i < this.props.numKeys; i++) {
            keys.push(<img key={ `key ${i}` } src={ `/img/forgedkey${i}.png` } title={ t('Forged Key') } />);
        }

        for(let i = this.props.numKeys; i < 3; i++) {
            keys.push(<img key={ `key ${i}` } src={ `/img/unforgedkey${i}.png` } title={ t('Unforged Key') } />);
        }

        return <div className={ `keys ${this.props.cardSize}` }>{ keys }</div>;
    }

    render() {
        let t = this.props.t;

        let cardPileProps = {
            manualMode: this.props.manualMode,
            onCardClick: this.props.onCardClick,
            onDragDrop: this.props.onDragDrop,
            onMouseOut: this.props.onMouseOut,
            onMouseOver: this.props.onMouseOver,
            popupLocation: this.props.side,
            size: this.props.cardSize
        };

        let sortedHand = this.props.hand.sort((a, b) => {
            if(a.printedHouse < b.printedHouse) {
                return -1;
            } else if(a.printedHouse > b.printedHouse) {
                return 1;
            }

            return 0;
        });

        let hand = (<SquishableCardPanel
            cards={ sortedHand }
            className='panel hand'
            groupVisibleCards
            username={ this.props.username }
            manualMode={ this.props.manualMode }
            maxCards={ 5 }
            onCardClick={ this.props.onCardClick }
            onMouseOut={ this.props.onMouseOut }
            onMouseOver={ this.props.onMouseOver }
            source='hand'
            title={ t('Hand') }
            cardSize={ this.props.cardSize } />);

        let drawDeck = (<DrawDeck
            cardCount={ this.props.numDeckCards }
            cards={ this.props.drawDeck }
            isMe={ this.props.isMe }
            manualMode={ this.props.manualMode }
            numDeckCards={ this.props.numDeckCards }
            onPopupChange={ this.props.onDrawPopupChange }
            onShuffleClick={ this.props.onShuffleClick }
            showDeck={ this.props.showDeck }
            spectating={ this.props.spectating }
            { ...cardPileProps } />);

        let hasArchivedCards = !!this.props.archives && (this.props.archives.length > 0);

        let archives = (<CardPile className='archives' title={ t('Archives') } source='archives' cards={ this.props.archives }
            hiddenTopCard={ hasArchivedCards && !this.props.isMe } disablePopup={ !this.props.isMe }
            { ...cardPileProps } />);

        let discard = (<CardPile className='discard' title={ t('Discard') } source='discard' cards={ this.props.discard }
            { ...cardPileProps } />);

        let purged = (<CardPile className='purged' title={ t('Purged') } source='purged' cards={ this.props.purgedPile }
            { ...cardPileProps } />);

        let identity = (<IdentityCard className='identity' deckCards={ this.props.deckCards } language={ this.props.i18n.language }
            houses={ this.props.houses } deckUuid={ this.props.deckUuid } deckName={ this.props.deckName }
            cards= { this.props.cards } size={ this.props.cardSize } onMouseOut={ this.props.onMouseOut }
            onMouseOver={ this.props.onMouseOver } />);

        return (
            <div className='player-home-row-container'>
                { this.renderKeys() }
                { this.renderDroppablePile('hand', hand) }
                { this.renderDroppablePile('archives', archives) }
                { identity }
                { this.renderDroppablePile('deck', drawDeck) }
                { this.renderDroppablePile('discard', discard) }
                { ((this.props.purgedPile.length > 0) || this.props.manualMode) ? this.renderDroppablePile('purged', purged) : null }
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    archives: PropTypes.array,
    cardSize: PropTypes.string,
    cards: PropTypes.object,
    conclavePile: PropTypes.array,
    deckCards: PropTypes.array,
    deckName: PropTypes.string,
    deckUuid: PropTypes.string,
    discard: PropTypes.array,
    drawDeck: PropTypes.array,
    faction: PropTypes.object,
    hand: PropTypes.array,
    houses: PropTypes.array,
    i18n: PropTypes.object,
    isMe: PropTypes.bool,
    isMelee: PropTypes.bool,
    manualMode: PropTypes.bool,
    numDeckCards: PropTypes.number,
    numKeys: PropTypes.number,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onDrawPopupChange: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onShuffleClick: PropTypes.func,
    power: PropTypes.number,
    purgedPile: PropTypes.array,
    showDeck: PropTypes.bool,
    side: PropTypes.oneOf(['top', 'bottom']),
    spectating: PropTypes.bool,
    t: PropTypes.func,
    title: PropTypes.object,
    username: PropTypes.string
};

export default withTranslation()(PlayerRow);
