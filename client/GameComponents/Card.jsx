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

        counters['card-fate'] = card.fate ? { count: card.fate, fade: card.type === 'attachment', shortName: 'F' } : undefined;

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
        let honorClass = '';

        if(this.props.source !== 'play area') {
            return null;
        }

        if(this.props.card.isHonored || this.props.card.isDishonored) {
            honorClass += ' honor';
        }

        var index = 1;
        var attachments = _.map(this.props.card.attachments, attachment => {
            var returnedAttachment = (<Card key={ attachment.uuid } source={ this.props.source } card={ attachment } className={ 'attachment attachment-' + index + honorClass } wrapped={ false }
                onMouseOver={ this.props.disableMouseOver ? null : this.onMouseOver.bind(this, attachment) }
                onMouseOut={ this.props.disableMouseOver ? null : this.onMouseOut }
                onClick={ this.props.onClick }
                onMenuItemClick={ this.props.onMenuItemClick }
                onDragStart={ ev => this.onCardDragStart(ev, attachment, this.props.source) } />);

            index += 1;

            return returnedAttachment;
        });

        return attachments;
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
        if(this.props.source !== 'play area' && this.props.source !== 'faction' && this.props.source !== 'revealed plots') {
            return false;
        }

        if(this.props.card.facedown || this.props.card.type === 'attachment') {
            return false;
        }

        return true;
    }

    showHonor() {
        if(this.props.card.isHonored || this.props.card.isDishonored) {
            return true;
        }

        return false;
    }

    isFacedown() {
        return this.props.card.facedown || !this.props.card.id;
    }
    
    isInPopup() {
        if(this.props.isInPopup) {
            return true;
        }
    }

    getCard() {
        let cardClass = 'card';
        let honorClass = '';
        let honorImage = '';
        let imageClass = 'card-image';
        let cardBack = 'cardback.jpg';

        if(!this.props.card) {
            return <div />;
        }

        cardClass += ' card-type-' + this.props.card.type;

        if(this.props.orientation === 'bowed' || this.props.card.bowed || this.props.card.isBroken) {
            cardClass += ' horizontal';
            honorClass += ' vertical bowed';
            imageClass += ' vertical bowed';
        } else if(this.props.orientation === 'horizontal') {
            cardClass += ' horizontal';
            honorClass += ' horizontal';
            imageClass += ' horizontal';
        } else {
            cardClass += ' vertical';
            honorClass += ' vertical';
            imageClass += ' vertical';
        }

        if(this.props.card.unselectable) {
            cardClass += ' unselectable';
        }

        if(this.props.card.selected) {
            cardClass += ' selected';
        } else if(this.props.card.selectable) {
            cardClass += ' selectable';
        } else if(this.props.card.inConflict) {
            cardClass += ' conflict';
        } else if(this.props.card.controlled) {
            cardClass += ' controlled';
        } else if(this.props.card.new) {
            cardClass += ' new';
        }

        if(this.props.className) {
            cardClass += ' ' + this.props.className;
        }

        if(this.props.card.isHonored || this.props.card.isDishonored) {
            cardClass += ' honor';
            imageClass += ' honor';
        }

        if(this.props.card.isConflict || this.props.source === 'conflict deck') {
            cardBack = 'conflictcardback.jpg';
        } else if(this.props.card.isDynasty || this.props.source === 'dynasty deck') {
            cardBack = 'dynastycardback.jpg';
        } else if(this.props.card.isProvince || this.props.source === 'province deck') {
            cardBack = 'provincecardback.jpg';
        } else {
            cardBack = 'cardback.jpg';
        }

        if(this.props.card.isHonored) {
            honorClass += ' honored';
            honorImage = 'honored.png';
        } else if(this.props.card.isDishonored) {
            honorClass += ' dishonored';
            honorImage = 'dishonored.png';
        }

        return (
            <div className='card-frame' ref='cardFrame'
                onTouchMove={ ev => this.onTouchMove(ev) }
                onTouchEnd={ ev => this.onTouchEnd(ev) }
                onTouchStart={ ev => this.onTouchStart(ev) }>
                { this.getCardOrder() }
                <div className={ cardClass }
                    onMouseOver={ this.props.disableMouseOver ? null : this.onMouseOver.bind(this, this.props.card) }
                    onMouseOut={ this.props.disableMouseOver ? null : this.onMouseOut }
                    onClick={ ev => this.onClick(ev, this.props.card) }
                    onDragStart={ ev => this.onCardDragStart(ev, this.props.card, this.props.source) }
                    draggable>
                    <div>
                        <span className='card-name'>{ this.props.card.name }</span>
                        <img className={ imageClass } src={ '/img/cards/' + ((!this.isFacedown() || this.isInPopup()) ? (this.props.card.id + '.jpg') : cardBack) } />
                        { this.showHonor() ? <img className={ honorClass } src={ '/img/' + honorImage } /> : null }
                    </div>
                    { this.showCounters() ? <CardCounters counters={ this.getCountersForCard(this.props.card) } /> : null }
                </div>
                { this.showMenu() ? <CardMenu menu={ this.props.card.menu } onMenuItemClick={ this.onMenuItemClick } /> : null }
            </div>);
    }

    render() {
        if(this.props.wrapped) {
            return (
                <div className='card-wrapper' style={ this.props.style }>
                    { this.getCard() }
                    { this.getAttachments() }
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
        id: React.PropTypes.string,
        controlled: React.PropTypes.bool,
        deck: React.PropTypes.string,
        facedown: React.PropTypes.bool,
        inConflict: React.PropTypes.bool,
        isConflict: React.PropTypes.bool,
        isDynasty: React.PropTypes.bool,
        isDishonored: React.PropTypes.bool,
        isHonored: React.PropTypes.bool,
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
        tokens: React.PropTypes.object,
        type: React.PropTypes.string,
        unselectable: React.PropTypes.bool
    }).isRequired,
    className: React.PropTypes.string,
    disableMouseOver: React.PropTypes.bool,
    isInPopup: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onDragDrop: React.PropTypes.func,
    onMenuItemClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    orientation: React.PropTypes.oneOf(['horizontal', 'bowed', 'vertical']),
    source: React.PropTypes.oneOf(['hand', 'dynasty discard pile', 'conflict discard pile', 'play area', 'dynasty deck', 'conflict deck', 'province deck', 'province 1', 'province 2', 'province 3', 'province 4', 'attachment', 'stronghold province', 'additional']).isRequired,
    style: React.PropTypes.object,
    wrapped: React.PropTypes.bool
};
Card.defaultProps = {
    orientation: 'vertical',
    wrapped: true
};

export default Card;
