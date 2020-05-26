import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import DrawDeck from './DrawDeck';
import IdentityCard from './IdentityCard';
import Droppable from './Droppable';

import { withTranslation } from 'react-i18next';
import { buildArchon, buildDeckList } from '../../archonMaker';
import * as actions from '../../redux/actions';

class PlayerRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { deckListUrl: 'img/idbacks/identity.jpg' };
        this.modifyKey = this.modifyKey.bind(this);
    }

    componentDidMount() {
        buildArchon(this.props.deckData, this.props.language).then((cardBackUrl) => {
            if (this.props.player === 1) {
                this.props.setPlayer1CardBack(cardBackUrl);
            } else {
                this.props.setPlayer2CardBack(cardBackUrl);
            }
        });
        if (!this.props.hideDecklist) {
            buildDeckList(
                { ...this.props.deckData, cards: this.props.deckCards },
                this.props.language,
                this.props.t,
                this.props.cards
            )
                .then((deckListUrl) => {
                    this.setState({ deckListUrl });
                })
                .catch(() => {
                    this.setState({ deckListUrl: 'img/idbacks/identity.jpg' });
                });
        } else {
            this.setState({ deckListUrl: 'img/idbacks/identity.jpg' });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.language) {
            if (
                this.props.language !== prevProps.language ||
                this.props.deckData.identity !== prevProps.deckData.identity ||
                this.props.hideDecklist !== prevProps.hideDecklist
            ) {
                buildArchon(this.props.deckData, this.props.language).then((cardBackUrl) => {
                    if (this.props.player === 1) {
                        this.props.setPlayer1CardBack(cardBackUrl);
                    } else {
                        this.props.setPlayer2CardBack(cardBackUrl);
                    }
                });
                if (!this.props.hideDecklist) {
                    buildDeckList(
                        { ...this.props.deckData, cards: this.props.deckCards },
                        this.props.language,
                        this.props.t,
                        this.props.cards
                    )
                        .then((deckListUrl) => {
                            this.setState({ deckListUrl });
                        })
                        .catch(() => {
                            this.setState({ deckListUrl: 'img/idbacks/identity.jpg' });
                        });
                } else {
                    this.setState({ deckListUrl: 'img/idbacks/identity.jpg' });
                }
            }
        }
    }

    modifyKey(color) {
        if (this.props.manualMode) {
            this.props.sendGameMessage('modifyKey', color, this.props.keys[color]);
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

    renderKeys() {
        let t = this.props.t;

        let keys = ['red', 'blue', 'yellow']
            .sort((color) => (this.props.keys[color] ? -1 : 1))
            .map((color) => {
                return (
                    <img
                        key={`key ${color}`}
                        src={`/img/${
                            this.props.keys[color] ? 'forgedkey' : 'unforgedkey'
                        }${color}.png`}
                        onClick={this.modifyKey.bind(this, color)}
                        title={t('Forged Key')}
                    />
                );
            });

        return <div className={`keys ${this.props.cardSize}`}>{keys}</div>;
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
            if (a.printedHouse < b.printedHouse) {
                return -1;
            } else if (a.printedHouse > b.printedHouse) {
                return 1;
            }

            return 0;
        });

        let hand = (
            <SquishableCardPanel
                cards={sortedHand}
                className='panel hand'
                groupVisibleCards
                cardBackUrl={this.props.cardBackUrl}
                username={this.props.username}
                manualMode={this.props.manualMode}
                maxCards={5}
                onCardClick={this.props.onCardClick}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
                source='hand'
                title={t('Hand')}
                cardSize={this.props.cardSize}
            />
        );

        let drawDeck = (
            <DrawDeck
                cardCount={this.props.numDeckCards}
                cards={this.props.drawDeck}
                isMe={this.props.isMe}
                manualMode={this.props.manualMode}
                numDeckCards={this.props.numDeckCards}
                onPopupChange={this.props.onDrawPopupChange}
                onShuffleClick={this.props.onShuffleClick}
                showDeck={this.props.showDeck}
                spectating={this.props.spectating}
                cardBackUrl={this.props.cardBackUrl}
                {...cardPileProps}
            />
        );

        let hasArchivedCards = !!this.props.archives && this.props.archives.length > 0;

        let archives = (
            <CardPile
                className='archives'
                title={t('Archives')}
                source='archives'
                cards={this.props.archives}
                hiddenTopCard={hasArchivedCards && !this.props.isMe}
                cardBackUrl={this.props.cardBackUrl}
                {...cardPileProps}
            />
        );

        let discard = (
            <CardPile
                className='discard'
                title={t('Discard')}
                source='discard'
                cards={this.props.discard}
                {...cardPileProps}
            />
        );

        let purged = (
            <CardPile
                className='purged'
                title={t('Purged')}
                source='purged'
                cards={this.props.purgedPile}
                {...cardPileProps}
            />
        );

        let identity = (
            <IdentityCard
                className='identity'
                deckListUrl={this.state.deckListUrl}
                size={this.props.cardSize}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
            />
        );

        return (
            <div className='player-home-row-container'>
                {this.renderKeys()}
                {this.renderDroppablePile('hand', hand)}
                {this.renderDroppablePile('archives', archives)}
                {identity}
                {this.renderDroppablePile('deck', drawDeck)}
                {this.renderDroppablePile('discard', discard)}
                {this.props.purgedPile.length > 0 || this.props.manualMode
                    ? this.renderDroppablePile('purged', purged)
                    : null}
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    archives: PropTypes.array,
    cardBackUrl: PropTypes.string,
    cardSize: PropTypes.string,
    cards: PropTypes.object,
    conclavePile: PropTypes.array,
    deckCards: PropTypes.array,
    deckData: PropTypes.object,
    discard: PropTypes.array,
    drawDeck: PropTypes.array,
    faction: PropTypes.object,
    hand: PropTypes.array,
    hideDecklist: PropTypes.bool,
    houses: PropTypes.array,
    i18n: PropTypes.object,
    isMe: PropTypes.bool,
    keys: PropTypes.object,
    language: PropTypes.string,
    manualMode: PropTypes.bool,
    numDeckCards: PropTypes.number,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onDrawPopupChange: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onShuffleClick: PropTypes.func,
    player: PropTypes.number,
    power: PropTypes.number,
    purgedPile: PropTypes.array,
    sendGameMessage: PropTypes.func,
    setPlayer1CardBack: PropTypes.func,
    setPlayer2CardBack: PropTypes.func,
    showDeck: PropTypes.bool,
    side: PropTypes.oneOf(['top', 'bottom']),
    spectating: PropTypes.bool,
    t: PropTypes.func,
    title: PropTypes.object,
    username: PropTypes.string
};

function mapStateToProps(state) {
    return {
        cards: state.cards.cards
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;
    return boundActions;
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps, null)(PlayerRow));
