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
            poison: 'P',
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

        counters['card-power'] = { count: card.power, fade: card.type === 'attachment', shortName: 'P' } || undefined;
        counters['strength'] = card.baseStrength !== card.strength ? { count: card.strength, fade: card.type === 'attachment', shortName: 'S' } : undefined;
        counters['dupe'] = card.dupes && card.dupes.length > 0 ? { count: card.dupes.length, fade: card.type === 'attachment', shortName: 'D' } : undefined;

        _.map(card.iconsAdded, icon => {
            counters[icon] = { count: 0, cancel: false, displayIfNoCount: true };
        });

        _.map(card.iconsRemoved, icon => {
            counters[icon] = { count: 0, cancel: true, displayIfNoCount: true };
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

    getDupes() {
        if(this.props.source !== 'play area') {
            return null;
        }

        var facedownDupes = _.filter(this.props.card.dupes, card => {
            return card.facedown;
        });

        if(!facedownDupes || facedownDupes.length === 0) {
            return;
        }

        var index = 1;
        var dupes = _.map(facedownDupes, dupe => {
            var returnedDupe = (<Card key={dupe.uuid} className={'card-dupe card-dupe-' + index} source={this.props.source} card={dupe} wrapped={false}
                            onMouseOver={this.props.disableMouseOver ? null : this.onMouseOver.bind(this, dupe)}
                            onMouseOut={this.props.disableMouseOver ? null : this.onMouseOut} />);

            index += 1;

            return returnedDupe;
        });

        return dupes;
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

        if(!this.props.card) {
            return <div />;
        }

        cardClass += ' card-type-' + this.props.card.type;

        if(this.props.orientation === 'kneeled' || this.props.card.kneeled || this.props.orientation === 'horizontal' && this.props.card.type !== 'plot') {
            cardClass += ' horizontal';
            imageClass += ' vertical kneeled';
        } else if(this.props.orientation === 'horizontal') {
            cardClass += ' horizontal';
            imageClass += ' horizontal';
        } else {
            cardClass += ' vertical';
            imageClass += ' vertical';
        }

        if(this.props.card.selected) {
            cardClass += ' selected';
        } else if(this.props.card.selectable) {
            cardClass += ' selectable';
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

        return (
                <div className='card-frame' ref='cardFrame'
                    onTouchMove={ev => this.onTouchMove(ev)}
                    onTouchEnd={ev => this.onTouchEnd(ev)}
                    onTouchStart={ev => this.onTouchStart(ev)}>
                    <div className={cardClass}
                        onMouseOver={this.props.disableMouseOver ? null : this.onMouseOver.bind(this, this.props.card)}
                        onMouseOut={this.props.disableMouseOver ? null : this.onMouseOut}
                        onClick={ev => this.onClick(ev, this.props.card)}
                        onDragStart={ev => this.onCardDragStart(ev, this.props.card, this.props.source)}
                        draggable>
                        <div>
                            <span className='card-name'>{this.props.card.name}</span>
                            <img className={imageClass} src={'/img/cards/' + (!this.isFacedown() ? (this.props.card.code + '.png') : 'cardback.jpg')} />
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
        baseStrength: React.PropTypes.number,
        code: React.PropTypes.string,
        controlled: React.PropTypes.bool,
        dupes: React.PropTypes.array,
        facedown: React.PropTypes.bool,
        iconsAdded: React.PropTypes.array,
        iconsRemoved: React.PropTypes.array,
        inChallenge: React.PropTypes.bool,
        kneeled: React.PropTypes.bool,
        menu: React.PropTypes.array,
        name: React.PropTypes.string,
        new: React.PropTypes.bool,
        power: React.PropTypes.number,
        selectable: React.PropTypes.bool,
        selected: React.PropTypes.bool,
        stealth: React.PropTypes.bool,
        strength: React.PropTypes.number,
        tokens: React.PropTypes.object,
        type: React.PropTypes.string
    }).isRequired,
    className: React.PropTypes.string,
    disableMouseOver: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onDragDrop: React.PropTypes.func,
    onMenuItemClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    orientation: React.PropTypes.oneOf(['horizontal', 'kneeled', 'vertical']),
    source: React.PropTypes.oneOf(['hand', 'discard pile', 'play area', 'dead pile', 'draw deck', 'plot deck', 'revealed plots', 'selected plot', 'attachment', 'agenda', 'faction', 'additional']).isRequired,
    style: React.PropTypes.object,
    wrapped: React.PropTypes.bool
};
Card.defaultProps = {
    orientation: 'vertical',
    wrapped: true
};

export default Card;
