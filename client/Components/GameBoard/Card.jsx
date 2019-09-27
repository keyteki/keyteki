import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'jquery-migrate';
import { DragSource } from 'react-dnd';

import CardMenu from './CardMenu';
import CardCounters from './CardCounters';
import CardImage from './CardImage';
import { ItemTypes } from '../../constants';

import SquishableCardPanel from './SquishableCardPanel';

import { withTranslation } from 'react-i18next';

const cardSource = {
    beginDrag(props) {
        return {
            card: props.card,
            source: props.source
        };
    },
    canDrag(props) {
        return props.canDrag || (!props.card.unselectable && props.card.canPlay);
    }
};

function collect(connect, monitor) {
    return {
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        dragOffset: monitor.getSourceClientOffset()
    };
}

class InnerCard extends React.Component {
    constructor() {
        super();

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);

        this.state = {
            showMenu: false
        };

        this.shortNames = {
            count: 'x',
            stand: 'T',
            poison: 'O',
            gold: 'G',
            valarmorghulis: 'V',
            betrayal: 'B',
            vengeance: 'N',
            ear: 'E',
            venom: 'M',
            kiss: 'K',
            bell: 'L'
        };
    }

    onMouseOver(card) {
        if(this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut() {
        if(this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    }

    isAllowedMenuSource() {
        return this.props.source === 'play area';
    }

    onClick(event, card) {
        event.preventDefault();
        event.stopPropagation();

        if(this.isAllowedMenuSource() && this.props.card.menu && this.props.card.menu.length !== 0) {
            this.setState({ showMenu: !this.state.showMenu });

            return;
        }

        if(this.props.onClick) {
            this.props.onClick(card);
        }
    }

    onMenuItemClick(menuItem) {
        if(this.props.onMenuItemClick) {
            this.props.onMenuItemClick(this.props.card, menuItem);
            this.setState({ showMenu: !this.state.showMenu });
        }
    }

    getCountersForCard(card) {
        let counters = [];
        let needsFade = card.type === 'upgrade' && !['full deck'].includes(this.props.source);

        if(card.type === 'creature' && card.baseStrength !== card.strength) {
            counters.push({ name: 'strength', count: card.strength, fade: needsFade, shortName: 'S' });
        }

        for(const [key, token] of Object.entries(card.tokens || {})) {
            counters.push({ name: key, count: token, fade: needsFade, shortName: this.shortNames[key] });
        }

        for(const upgrade of card.upgrades || []) {
            counters = counters.concat(this.getCountersForCard(upgrade));
        }

        if(card.stunned) {
            counters.push({ name: 'stun', count: 1, shortName: '' });
        }

        return counters.filter(counter => counter.count >= 0);
    }

    getupgrades() {
        if(!['full deck', 'play area'].includes(this.props.source)) {
            return null;
        }

        var index = 1;
        var upgrades = this.props.card.upgrades.map(upgrade => {
            var returnedupgrade = (<Card key={ upgrade.uuid } source={ this.props.source } card={ upgrade }
                className={ classNames('upgrade', `upgrade-${index}`) } wrapped={ false }
                onMouseOver={ this.props.disableMouseOver ? null : this.onMouseOver.bind(this, upgrade) }
                onMouseOut={ this.props.disableMouseOver ? null : this.onMouseOut }
                onClick={ this.props.onClick }
                onMenuItemClick={ this.props.onMenuItemClick }
                size={ this.props.size } />);

            index += 1;

            return returnedupgrade;
        });

        return upgrades;
    }

    renderUnderneathCards() {
        // TODO: Right now it is assumed that all cards in the childCards array
        // are being placed underneath the current card. In the future there may
        // be other types of cards in this array and it should be filtered.
        let underneathCards = this.props.card.childCards;
        if(!underneathCards || underneathCards.length === 0) {
            return;
        }

        let maxCards = 1 + (underneathCards.length - 1) / 6;

        return (
            <SquishableCardPanel
                cardSize={ this.props.size }
                cards={ underneathCards }
                className='underneath'
                maxCards={ maxCards }
                onCardClick={ this.props.onClick }
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                source='underneath' />);
    }

    getCardOrder() {
        if(!this.props.card.order) {
            return null;
        }

        return (<div className='card-order'>{ this.props.card.order }</div>);
    }

    showMenu() {
        if(!this.isAllowedMenuSource()) {
            return false;
        }

        if(!this.props.card.menu || !this.state.showMenu) {
            return false;
        }

        return true;
    }

    showCounters() {
        if(['full deck'].includes(this.props.source)) {
            return true;
        }

        if(this.props.source !== 'play area' && this.props.source !== 'faction') {
            return false;
        }

        if(this.props.card.facedown || this.props.card.type === 'upgrade') {
            return false;
        }

        return true;
    }

    isFacedown() {
        return this.props.card.facedown || !this.props.card.name;
    }

    getDragFrame(image) {
        if(!this.props.isDragging) {
            return null;
        }

        let style = {};

        if(this.props.dragOffset && this.props.isDragging) {
            let x = this.props.dragOffset.x;
            let y = this.props.dragOffset.y;

            style = {
                left: x,
                top: y
            };
        }

        return (
            <div className='drag-preview' style={ style }>
                { image }
            </div>);
    }

    getCard() {
        if(!this.props.card) {
            return <div />;
        }

        let cardClass = classNames('card', `card-type-${this.props.card.type}`, this.props.className, this.sizeClass, this.statusClass, {
            'custom-card': this.props.card.code && this.props.card.code.startsWith('custom'),
            'horizontal': this.props.orientation !== 'vertical' || this.props.card.exhausted,
            'vertical': this.props.orientation === 'vertical' && !this.props.card.exhausted,
            'can-play': this.statusClass !== 'selectable' && !this.props.card.unselectable && this.props.card.canPlay,
            'unselectable': this.props.card.unselectable,
            'dragging': this.props.isDragging,
            'controlled': this.props.card.controlled,
            'taunt': this.props.card.taunt && this.props.source === 'play area'
        });
        let imageClass = classNames('card-image vertical', this.sizeClass, {
            'exhausted': (this.props.orientation === 'exhausted' || this.props.card.exhausted || this.props.orientation === 'horizontal')
        });

        let image = (<CardImage className={ imageClass }
            img={ this.imageUrl }
            language={ this.props.language }
            maverick={ !this.isFacedown() ? this.props.card.maverick : null }
            amber={ !this.isFacedown() ? this.props.card.cardPrintedAmber : 0 }/>);

        let content = this.props.connectDragSource(
            <div className='card-frame'>
                { this.getDragFrame(image) }
                { this.getCardOrder() }
                <div className={ cardClass }
                    onMouseOver={ this.props.disableMouseOver ? null : this.onMouseOver.bind(this, this.props.card) }
                    onMouseOut={ this.props.disableMouseOver ? null : this.onMouseOut }
                    onClick={ ev => this.onClick(ev, this.props.card) }>
                    <div>
                        <span className='card-name'>{ this.props.card.name }</span>
                        { image }
                    </div>
                    { this.showCounters() ? <CardCounters counters={ this.getCountersForCard(this.props.card) } /> : null }
                </div>
                { this.showMenu() ? <CardMenu menu={ this.props.card.menu } onMenuItemClick={ this.onMenuItemClick } /> : null }
            </div>);

        return this.props.connectDragPreview(content);
    }

    get imageUrl() {
        let image = '/img/idbacks/cardback.jpg';

        if(!this.isFacedown()) {
            image = `/img/cards/${this.props.card.image}.png`;
        }

        return image;
    }

    get sizeClass() {
        return {
            [this.props.size]: this.props.size !== 'normal'
        };
    }

    get statusClass() {
        if(!this.props.card) {
            return;
        }

        if(this.props.card.selected) {
            return 'selected';
        } else if(this.props.card.selectable) {
            return 'selectable';
        } else if(this.props.card.inDanger) {
            return 'in-danger';
        } else if(this.props.card.saved) {
            return 'saved';
        } else if(this.props.card.new) {
            return 'new';
        }
    }

    render() {
        if(this.props.wrapped) {
            return (
                <div className='card-wrapper' style={ this.props.style }>
                    { this.getCard() }
                    { this.getupgrades() }
                    { this.renderUnderneathCards() }
                </div>);
        }

        return this.getCard();
    }
}

InnerCard.displayName = 'Card';
InnerCard.propTypes = {
    canDrag: PropTypes.bool,
    card: PropTypes.shape({
        attached: PropTypes.bool,
        baseStrength: PropTypes.number,
        childCards: PropTypes.array,
        canPlay: PropTypes.bool,
        code: PropTypes.string,
        controlled: PropTypes.bool,
        facedown: PropTypes.bool,
        factionStatus: PropTypes.array,
        image: PropTypes.string,
        inDanger: PropTypes.bool,
        exhausted: PropTypes.bool,
        menu: PropTypes.array,
        name: PropTypes.string,
        new: PropTypes.bool,
        order: PropTypes.number,
        power: PropTypes.number,
        saved: PropTypes.bool,
        selectable: PropTypes.bool,
        selected: PropTypes.bool,
        strength: PropTypes.number,
        taunt: PropTypes.bool,
        tokens: PropTypes.object,
        type: PropTypes.string,
        unselectable: PropTypes.bool,
        upgrades: PropTypes.array,
        maverick: PropTypes.string,
        cardPrintedAmber: PropTypes.number
    }).isRequired,
    className: PropTypes.string,
    connectDragPreview: PropTypes.func,
    connectDragSource: PropTypes.func,
    disableMouseOver: PropTypes.bool,
    dragOffset: PropTypes.object,
    isDragging: PropTypes.bool,
    language: PropTypes.string,
    onClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    orientation: PropTypes.oneOf(['horizontal', 'exhausted', 'vertical']),
    size: PropTypes.string,
    source: PropTypes.oneOf(['archives', 'hand', 'discard', 'deck', 'purged', 'play area', 'upgrade']).isRequired,
    style: PropTypes.object,
    wrapped: PropTypes.bool
};
InnerCard.defaultProps = {
    orientation: 'vertical',
    wrapped: true
};

const Card = DragSource(ItemTypes.CARD, cardSource, collect)(InnerCard);

export default withTranslation()(Card);

