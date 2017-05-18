import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import 'jquery-migrate';
import 'jquery-nearest';

import CardMenu from './CardMenu.jsx';
import CardCounters from './CardCounters.jsx';

class Card extends React.Component {
    constructor() {
        super();

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);

        this.state = {
            showMenu: false
        };

        this.shortNames = {
            stand: 'T',
            poison: 'O',
            gold: 'G',
            valarmorghulis: 'V',
            betrayal: 'B',
            vengeance: 'N',
            ear: 'E',
            venom: 'M'
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

    onCardDragStart(event, card, source) {
        var dragData = { card: card, source: source };

        event.dataTransfer.setData('Text', JSON.stringify(dragData));
    }

    onTouchMove(event) {
        event.preventDefault();
        var touch = event.targetTouches[0];

        event.currentTarget.style.left = touch.pageX - 32 + 'px';
        event.currentTarget.style.top = touch.pageY - 42 + 'px';
        event.currentTarget.style.position = 'fixed';
    }

    getReactComponentFromDOMNode(dom) {
        for(var key in dom) {
            if(key.indexOf('__reactInternalInstance$') === 0) {
                var compInternals = dom[key]._currentElement;
                var compWrapper = compInternals._owner;
                var comp = compWrapper._instance;
                return comp;
            }
        }

        return null;
    }

    onTouchStart(event) {
        this.setState({ touchStart: $(event.currentTarget).position() });
    }

    onTouchEnd(event) {
        var target = $(event.currentTarget);
        var nearestPile = target.nearest('.card-pile, .hand, .player-board');

        var pilePosition = nearestPile.position();
        var cardPosition = target.position();

        if(cardPosition.left + target.width() > pilePosition.left - 10 && cardPosition.left < pilePosition.left + nearestPile.width() + 10) {
            var dropTarget = '';

            if(_.includes(nearestPile.attr('class'), 'hand')) {
                dropTarget = 'hand';
            } else if(_.includes(nearestPile.attr('class'), 'player-board')) {
                dropTarget = 'play area';
            } else {
                var component = this.getReactComponentFromDOMNode(nearestPile[0]);
                dropTarget = component.props.source;
            }

            if(dropTarget && this.props.onDragDrop) {
                this.props.onDragDrop(this.props.card, this.props.source, dropTarget);
            }
        }

        target.css({left: this.state.touchStart.left + 'px', top: this.state.touchStart.top + 'px'});
        event.currentTarget.style.position = 'initial';
    }

    isAllowedMenuSource() {
        return this.props.source === 'play area' || this.props.source === 'agenda' || this.props.source === 'revealed plots';
    }

    onClick(event, card) {
        event.preventDefault();
        event.stopPropagation();

        if(this.isAllowedMenuSource() && !_.isEmpty(this.props.card.menu)) {
            this.setState({showMenu: !this.state.showMenu});

            return;
        }

        if(this.props.onClick) {
            this.props.onClick(card);
        }
    }

    onMenuItemClick(menuItem) {
        if(this.props.onMenuItemClick) {
            this.props.onMenuItemClick(this.props.card, menuItem);
            this.setState({showMenu: !this.state.showMenu});
        }
    }

    getCountersForCard(card) {
        var counters = {};

        counters['card-power'] = card.power ? { count: card.power, fade: card.type === 'attachment', shortName: 'P' } : undefined;
        counters['strength'] = card.baseStrength !== card.strength ? { count: card.strength, fade: card.type === 'attachment', shortName: 'S' } : undefined;
        counters['dupe'] = card.dupes && card.dupes.length > 0 ? { count: card.dupes.length, fade: card.type === 'attachment', shortName: 'D' } : undefined;

        _.map(card.iconsAdded, icon => {
            counters[icon] = { count: 0, cancel: false };
        });

        _.map(card.iconsRemoved, icon => {
            counters[icon] = { count: 0, cancel: true };
        });

        _.each(card.tokens, (token, key) => {
            counters[key] = { count: token, fade: card.type === 'attachment', shortName: this.shortNames[key] };
        });

        _.each(card.attachments, attachment => {
            _.extend(counters, this.getCountersForCard(attachment));
        });

        var filteredCounters = _.omit(counters, counter => {
            return _.isUndefined(counter) || _.isNull(counter) || counter < 0;
        });

        return filteredCounters;
    }

    getAttachments() {
        if(this.props.source !== 'play area') {
            return null;
        }

        var index = 1;
        var attachments = _.map(this.props.card.attachments, attachment => {
            var returnedAttachment = (<Card key={attachment.uuid} source={this.props.source} card={attachment} className={'attachment attachment-' + index} wrapped={false}
                            onMouseOver={this.props.disableMouseOver ? null : this.onMouseOver.bind(this, attachment)}
                            onMouseOut={this.props.disableMouseOver ? null : this.onMouseOut}
                            onClick={this.props.onClick}
                            onMenuItemClick={this.props.onMenuItemClick}
                            onDragStart={ev => this.onCardDragStart(ev, attachment, this.props.source)} />);

            index += 1;

            return returnedAttachment;
        });

        return attachments;
    }

    getCardOrder() {
        if(!this.props.card.order) {
            return null;
        }

        return (<div className='card-order'>{this.props.card.order}</div>);
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
        if(this.props.source !== 'play area' && this.props.source !== 'faction' && this.props.source !== 'revealed plots') {
            return false;
        }

        if(this.props.card.facedown || this.props.card.type === 'attachment') {
            return false;
        }

        return true;
    }

    isFacedown() {
        return this.props.card.facedown || !this.props.card.code;
    }

    getCard() {
        var cardClass = 'card';
        var imageClass = 'card-image';
        var cardBack = 'cardback.jpg';

        if(!this.props.card) {
            return <div />;
        }

        cardClass += ' card-type-' + this.props.card.type;

        if(this.props.orientation === 'bowed' || this.props.card.bowed || this.props.orientation === 'horizontal' && this.props.card.type !== 'plot') {
            cardClass += ' horizontal';
            imageClass += ' vertical bowed';
        } else if(this.props.orientation === 'horizontal') {
            cardClass += ' horizontal';
            imageClass += ' horizontal';
        } else {
            cardClass += ' vertical';
            imageClass += ' vertical';
        }

        if(this.props.card.unselectable) {
            cardClass += ' unselectable';
        }

        if(this.props.card.selected) {
            cardClass += ' selected';
        } else if(this.props.card.selectable) {
            cardClass += ' selectable';
        } else if(this.props.card.inDanger) {
            cardClass += ' in-danger';
        } else if(this.props.card.saved) {
            cardClass += ' saved';
        } else if(this.props.card.inChallenge) {
            cardClass += ' challenge';
        } else if(this.props.card.stealth) {
            cardClass += ' stealth';
        } else if(this.props.card.controlled) {
            cardClass += ' controlled';
        } else if(this.props.card.new) {
            cardClass += ' new';
        }

        if(this.props.className) {
            cardClass += ' ' + this.props.className;
        }

        if(this.props.card.isConflict) {
            cardBack = 'conflictcardback.jpg'
        } else if(this.props.card.isDynasty) {
            cardBack = 'dynastycardback.jpg'
        } else if(this.props.card.isProvince) {
            cardBack = 'provincecardback.jpg'
        } else {
            cardBack = 'cardback.jpg'
        }

        return (
                <div className='card-frame' ref='cardFrame'
                    onTouchMove={ev => this.onTouchMove(ev)}
                    onTouchEnd={ev => this.onTouchEnd(ev)}
                    onTouchStart={ev => this.onTouchStart(ev)}>
                    {this.getCardOrder()}
                    <div className={cardClass}
                        onMouseOver={this.props.disableMouseOver ? null : this.onMouseOver.bind(this, this.props.card)}
                        onMouseOut={this.props.disableMouseOver ? null : this.onMouseOut}
                        onClick={ev => this.onClick(ev, this.props.card)}
                        onDragStart={ev => this.onCardDragStart(ev, this.props.card, this.props.source)}
                        draggable>
                        <div>
                            <span className='card-name'>{this.props.card.name}</span>
                            <img className={imageClass} src={'/img/cards/' + (!this.isFacedown() ? (this.props.card.code + '.png') : cardBack)} />
                        </div>
                        { this.showCounters() ? <CardCounters counters={ this.getCountersForCard(this.props.card) } /> : null }
                    </div>
                    { this.showMenu() ? <CardMenu menu={ this.props.card.menu } onMenuItemClick={ this.onMenuItemClick } /> : null }
                </div>);
    }

    render() {
        if(this.props.wrapped) {
            return (
                    <div className='card-wrapper' style={this.props.style}>
                        {this.getCard()}
                        {this.getDupes()}
                        {this.getAttachments()}
                    </div>);
        }

        return this.getCard();
    }
}

Card.displayName = 'Card';
Card.propTypes = {
    card: React.PropTypes.shape({
        attached: React.PropTypes.bool,
        attachments: React.PropTypes.array,
        baseMilitarySkill: React.PropTypes.number,
        basePoliticalSkill: React.PropTypes.number,
        code: React.PropTypes.string,
        controlled: React.PropTypes.bool,
        facedown: React.PropTypes.bool,
        inConflict: React.PropTypes.bool,
        inDanger: React.PropTypes.bool,
        isConflict: React.PropTypes.bool,
        isDynastay: React.PropTypes.bool,
        isProvince: React.PropTypes.bool,
        bowed: React.PropTypes.bool,
        menu: React.PropTypes.array,
        militarySkill: React.PropTypes.number,
        name: React.PropTypes.string,
        new: React.PropTypes.bool,
        order: React.PropTypes.number,
        politicalSkill: React.PropTypes.number,
        power: React.PropTypes.number,
        saved: React.PropTypes.bool,
        selectable: React.PropTypes.bool,
        selected: React.PropTypes.bool,
        stealth: React.PropTypes.bool,
        tokens: React.PropTypes.object,
        type: React.PropTypes.string,
        unselectable: React.PropTypes.bool
    }).isRequired,
    className: React.PropTypes.string,
    disableMouseOver: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onDragDrop: React.PropTypes.func,
    onMenuItemClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    orientation: React.PropTypes.oneOf(['horizontal', 'bowed', 'vertical']),
    source: React.PropTypes.oneOf(['hand', 'dynasty discard pile', 'conflict discard pile', 'play area', 'dead pile', 'dynasty draw deck', 'conflict draw deck', 'province deck', 'revealed provinces',  'attachment', 'agenda', 'stronghold', 'additional']).isRequired,
    style: React.PropTypes.object,
    wrapped: React.PropTypes.bool
};
Card.defaultProps = {
    orientation: 'vertical',
    wrapped: true
};

export default Card;
