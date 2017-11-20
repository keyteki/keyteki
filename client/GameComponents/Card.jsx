import React from 'react';
import PropTypes from 'prop-types';
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
            showPopup: false,
            showMenu: false
        };

        this.shortNames = {
            stand: 'T',
            poison: 'O',
            gold: 'G',
            valarmorghulis: 'V',
            betrayal: 'B',
            vengeance: 'N'
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

        target.css({ left: this.state.touchStart.left + 'px', top: this.state.touchStart.top + 'px' });
        event.currentTarget.style.position = 'initial';
    }

    isAllowedMenuSource() {
        return this.props.source === 'play area';
    }

    onClick(event, card) {
        event.preventDefault();
        event.stopPropagation();

        if(!_.isEmpty(this.props.card.menu)) {
            this.setState({ showMenu: !this.state.showMenu });

            return;
        }

        if(this.props.showPopup) {
            this.setState({ showPopup: !this.state.showPopup });
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
        var counters = {};

        counters['card-fate'] = card.fate ? { count: card.fate, fade: card.type === 'attachment', shortName: 'F' } : undefined;
        if(card.isHonored) {
            counters['honor-status'] = { count: 1, fade: card.type === 'attachment', shortName: 'H' };
        } else if(card.isDishonored) {
            counters['honor-status'] = { count: 2, fade: card.type === 'attachment', shortName: 'D' };
        } else {
            counters['honor-status'] = undefined;    
        }

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

    getWrapper() {
        let wrapperClassName = '';
        let attachments = _.size(this.props.card.attachments);
        if(attachments > 0) {
            wrapperClassName = 'wrapper-' + attachments.toString();
        }

        return wrapperClassName;
    }

    getAttachments() {

        if(this.props.source !== 'play area') {
            return null;
        }

        var index = 1;
        var attachments = _.map(this.props.card.attachments, attachment => {
            var returnedAttachment = (<Card key={ attachment.uuid } source={ this.props.source } card={ attachment }
                className={ 'attachment attachment-' + index } wrapped={ false }
                onMouseOver={ this.props.disableMouseOver ? null : this.onMouseOver.bind(this, attachment) }
                onMouseOut={ this.props.disableMouseOver ? null : this.onMouseOut }
                onClick={ this.props.onClick }
                onMenuItemClick={ this.props.onMenuItemClick }
                onDragStart={ ev => this.onCardDragStart(ev, attachment, this.props.source) }
                size={ this.props.size } />);

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
        /*
        if(!this.isAllowedMenuSource()) {
            return false;
        }*/

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
        return this.props.card.facedown || !this.props.card.id;
    }

    isInPopup() {
        if(this.props.isInPopup) {
            return true;
        }
        return this.props.card.facedown || !this.props.card.id;
    }

    getCard() {
        var cardClass = 'card';
        var imageClass = 'card-image';
        var cardBack = 'cardback.jpg';

        if(!this.props.card) {
            return <div />;
        }

        if(this.props.size !== 'normal') {
            cardClass += ' ' + this.props.size;
            imageClass += ' ' + this.props.size;
        }

        /* No custom cards currently
        if(this.props.card.code && this.props.card.code.startsWith('custom')) {
            cardClass += ' custom-card';
        }
        */

        cardClass += ' card-type-' + this.props.card.type;

        if(this.props.orientation === 'bowed' || this.props.card.bowed) {
            cardClass += ' horizontal';
            imageClass += ' vertical bowed';
        } else if(this.props.card.isBroken) {
            cardClass += ' vertical';
            imageClass += ' vertical broken';
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
        } else if(this.props.card.inConflict) {
            cardClass += ' conflict';
        } else if(this.props.card.covert) {
            cardClass += ' covert';
        } else if(this.props.card.controlled) {
            cardClass += ' controlled';
        } else if(this.props.card.new) {
            cardClass += ' new';
        }

        if(this.props.className) {
            cardClass += ' ' + this.props.className;
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
                        <img className={ imageClass } src={ '/img/cards/' + (!this.isFacedown() ? (this.props.card.id + '.jpg') : cardBack) } />
                    </div>
                    { this.showCounters() ? <CardCounters counters={ this.getCountersForCard(this.props.card) } /> : null }
                </div>
                { this.showMenu() ? <CardMenu menu={ this.props.card.menu } onMenuItemClick={ this.onMenuItemClick } /> : null }
                { this.getPopup() }
            </div>);
    }

    onCloseClick(event) {
        event.preventDefault();
        event.stopPropagation();

        this.setState({ showPopup: !this.state.showPopup });

        if(this.props.onCloseClick) {
            this.props.onCloseClick();
        }
    }

    onPopupCardClick(card) {
        this.setState({ showPopup: false });

        if(this.props.onClick) {
            this.props.onClick(card);
        }
    }

    onPopupMenuItemClick() {
        this.setState({ showPopup: false });
        
        if(this.props.onClick) {
            this.props.onClick(this.props.card);
        }
    }
    
    getPopup() {
        let popup = null;
        let cardIndex = 0;

        let cardList = _.map(this.props.card.attachments, card => {
            let cardKey = card.uuid || cardIndex++;
            return (<Card key={ cardKey } card={ card } source={ this.props.source }
                disableMouseOver={ this.props.disableMouseOver }
                onMouseOver={ this.props.onMouseOver }
                onMouseOut={ this.props.onMouseOut }
                onTouchMove={ this.props.onTouchMove }
                onClick={ this.onPopupCardClick.bind(this, card) }
                onDragDrop={ this.props.onDragDrop }
                orientation={ this.props.orientation === 'bowed' ? 'vertical' : this.props.orientation }
                size={ this.props.size } />);
        });

        if(!this.props.card.showPopup || !this.state.showPopup) {
            return null;
        }

        let popupClass = 'panel';
        let arrowClass = 'arrow lg';

        if(this.props.popupLocation === 'top') {
            popupClass += ' our-side';
            arrowClass += ' down';
        } else {
            arrowClass += ' up';
        }

        if(this.props.orientation === 'horizontal') {
            arrowClass = 'arrow lg left';
        }

        let linkIndex = 0;
        
        let popupMenu = this.props.card.popupMenuText ? (<div>{ [<a className='btn btn-default' key={ linkIndex++ } onClick={ () => this.onPopupMenuItemClick() }>{ this.props.card.popupMenuText }</a>] }</div>) : null;
        
        popup = (
            <div className='popup'>
                <div className='panel-title' onClick={ event => event.stopPropagation() }>
                    <span className='text-center'>{ this.props.title }</span>
                    <span className='pull-right'>
                        <a className='close-button glyphicon glyphicon-remove' onClick={ this.onCloseClick.bind(this) } />
                    </span>
                </div>
                <div className={ popupClass } onClick={ event => event.stopPropagation() }>
                    <div className='inner'>
                        { cardList }
                    </div>
                    <div className={ arrowClass } />
                </div>
            </div>);

        return popup;
    }

    render() {
        if(this.props.wrapped) {
            return (
                <div className={ 'card-wrapper ' + this.getWrapper() } style={ this.props.style }>
                    { this.getCard() }
                    { this.getAttachments() }
                </div>);
        }

        return this.getCard();
    }
}

Card.displayName = 'Card';
Card.propTypes = {
    card: PropTypes.shape({
        attached: PropTypes.bool,
        attachments: PropTypes.array,
        baseMilitarySkill: PropTypes.number,
        basePoliticalSkill: PropTypes.number,
        id: PropTypes.string,
        controlled: PropTypes.bool,
        facedown: PropTypes.bool,
        inConflict: PropTypes.bool,
        inDanger: PropTypes.bool,
        isBroken: PropTypes.bool,
        isConflict: PropTypes.bool,
        isDynasty: PropTypes.bool,
        isDishonored: PropTypes.bool,
        isHonored: PropTypes.bool,
        isProvince: PropTypes.bool,
        bowed: PropTypes.bool,
        covert: PropTypes.bool,
        menu: PropTypes.array,
        militarySkill: PropTypes.number,
        name: PropTypes.string,
        new: PropTypes.bool,
        order: PropTypes.number,
        politicalSkill: PropTypes.number,
        popupMenuText: PropTypes.array,
        power: PropTypes.number,
        saved: PropTypes.bool,
        selectable: PropTypes.bool,
        selected: PropTypes.bool,
        showPopup: PropTypes.bool,
        strength: PropTypes.number,
        tokens: PropTypes.object,
        type: PropTypes.string,
        unselectable: PropTypes.bool
    }).isRequired,
    className: PropTypes.string,
    disableMouseOver: PropTypes.bool,
    isInPopup: PropTypes.bool,
    onClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    orientation: PropTypes.oneOf(['horizontal', 'bowed', 'vertical']),
    popupLocation: PropTypes.string,
    size: PropTypes.string,
    source: PropTypes.oneOf(['hand', 'dynasty discard pile', 'conflict discard pile', 'play area', 'dynasty deck', 'conflict deck', 'province deck', 'province 1', 'province 2', 'province 3', 'province 4', 'attachment', 'stronghold province', 'additional', 'role card']).isRequired,
    style: PropTypes.object,
    wrapped: PropTypes.bool
};
Card.defaultProps = {
    orientation: 'vertical',
    wrapped: true
};

export default Card;
