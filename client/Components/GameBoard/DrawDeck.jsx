import React from 'react';
import PropTypes from 'prop-types';

import CardPile from './CardPile';
import Droppable from './Droppable';

import { withTranslation } from 'react-i18next';

class DrawDeck extends React.Component {
    constructor() {
        super();

        this.handlePileClick = this.handlePileClick.bind(this);
        this.handleShowDeckClick = this.handleShowDeckClick.bind(this);
        this.handleShuffleClick = this.handleShuffleClick.bind(this);
        this.handlePopupChange = this.handlePopupChange.bind(this);

        this.state = {
            showDrawMenu: false
        };
    }

    handlePileClick() {
        this.setState({ showDrawMenu: !this.state.showDrawMenu });
    }

    handleShowDeckClick() {
        if (this.props.onPopupChange) {
            this.props.onPopupChange({ visible: true });
        }
    }

    handleShuffleClick() {
        if (this.props.onShuffleClick) {
            this.props.onShuffleClick();
        }
    }

    handlePopupChange(event) {
        if (this.props.onPopupChange && !event.visible) {
            this.props.onPopupChange({ visible: false });
        }
    }

    renderDroppablePile(source, child) {
        return this.props.isMe ? (
            <Droppable
                onDragDrop={this.props.onDragDrop}
                source={source}
                manualMode={this.props.manualMode}
            >
                {child}
            </Droppable>
        ) : (
            child
        );
    }

    render() {
        let t = this.props.t;
        let drawDeckPopupMenu = this.props.showDeck
            ? [{ text: 'Close and Shuffle', handler: this.handleShuffleClick }]
            : null;

        let hasCards = !!this.props.cards && this.props.cards.length !== 0;

        let drawDeck = (
            <CardPile
                className='draw'
                cardCount={this.props.cardCount}
                cardBackUrl={this.props.cardBackUrl}
                cards={this.props.cards}
                disablePopup={!hasCards && (this.props.spectating || !this.props.isMe)}
                hiddenTopCard
                manualMode={this.props.manualMode}
                onCardClick={this.props.onCardClick}
                onDragDrop={this.props.onDragDrop}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
                onPopupChange={this.handlePopupChange}
                popupLocation={this.props.popupLocation}
                popupMenu={drawDeckPopupMenu}
                size={this.props.size}
                source='deck'
                title={t('Draw')}
            />
        );

        return this.renderDroppablePile('deck', drawDeck);
    }
}

DrawDeck.propTypes = {
    cardBackUrl: PropTypes.string,
    cardCount: PropTypes.number,
    cards: PropTypes.array,
    i18n: PropTypes.object,
    isMe: PropTypes.bool,
    manualMode: PropTypes.bool,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onPopupChange: PropTypes.func,
    onShuffleClick: PropTypes.func,
    popupLocation: PropTypes.oneOf(['top', 'bottom']),
    showDeck: PropTypes.bool,
    size: PropTypes.string,
    spectating: PropTypes.bool,
    t: PropTypes.func
};

export default withTranslation()(DrawDeck);
