import React from 'react';
import _ from 'underscore';

class Card extends React.Component {
    constructor() {
        super();

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);

        this.state = {
            showMenu: false
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

    isAllowedMenuSource() {
        return this.props.source === 'play area' || this.props.source === 'agenda' || this.props.source === 'revealed plots';
    }

    onClick(event, card, source) {
        event.preventDefault();
        event.stopPropagation();

        if(this.isAllowedMenuSource() && !_.isEmpty(this.props.card.menu)) {
            this.setState({showMenu: !this.state.showMenu});

            return;
        }

        if(this.props.onClick) {
            this.props.onClick(source, card);
        }
    }

    onMenuItemClick(menuItem) {
        if(this.props.onMenuItemClick) {
            this.props.onMenuItemClick(this.props.source, this.props.card, menuItem);
            this.setState({showMenu: !this.state.showMenu});
        }
    }

    getCounters() {
        var counters = {};

        if(this.props.source !== 'play area' && this.props.source !== 'faction') {
            return null;
        }

        counters['power'] = this.props.card.power;
        counters['strength'] = this.props.card.baseStrength !== this.props.card.strength ? this.props.card.strength : 0;
        counters['dupe'] = this.props.card.dupes && this.props.card.dupes.length > 0 ? this.props.card.dupes.length : 0;

        _.extend(counters, this.props.card.tokens);

        var filteredCounters = _.omit(counters, counter => {
            return _.isUndefined(counter) || _.isNull(counter) || counter <= 0;
        });

        var counterDivs = _.map(filteredCounters, (counterValue, key) => {
            return <div key={key} className={'counter ' + key}>{counterValue}</div>;
        });

        return counterDivs.length !== 0 ? (
            <div className='counters ignore-mouse-events'>
                {counterDivs}
            </div>) : null;
    }

    getAttachments() {
        if(this.props.source !== 'play area') {
            return null;
        }

        var index = 1;
        var attachments = _.map(this.props.card.attachments, attachment => {
            var returnedAttachment = (<Card key={attachment.uuid} source={this.props.source} card={attachment} className={"attachment attachment-" + index} wrapped={false}
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

    getMenu() {
        if(!this.isAllowedMenuSource()) {
            return null;
        }

        var menuIndex = 0;
        var menuItems = this.props.card.menu && this.state.showMenu ? _.map(this.props.card.menu, menuItem => {
            return <div key={menuIndex++} onClick={this.onMenuItemClick.bind(this, menuItem)}>{menuItem.text}</div>;
        }) : null;

        return menuItems && menuItems.length !== 0 ? (
            <div className='panel menu'>
                {menuItems}
            </div>
        ) : null;
    }

    isFacedown() {
        return this.props.card.facedown || !this.props.card.code;
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

    getCard() {
        var cardClass = 'card';
        var imageClass = 'card-image';

        if(!this.props.card) {
            return <div />;
        }

        if(this.props.card.kneeled || this.props.horizontal) {
            cardClass += ' horizontal';
            imageClass += ' vertical kneeled';
        } else if(this.props.card.type === 'plot') {
            cardClass += ' horizontal';
            imageClass += ' horizontal';
        } else {
            cardClass += ' vertical';
            imageClass += ' vertical';
        }

        if(this.props.card.selected) {
            cardClass += ' selected';
        } else if(this.props.card.controlled) {
            cardClass += ' controlled';
        } else if(this.props.card.new) {
            cardClass += ' new';
        }

        if(this.props.className) {
            cardClass += ' ' + this.props.className;
        }

        return (
                <div className='card-frame'>
                    <div className={cardClass}
                        onMouseOver={this.props.disableMouseOver ? null : this.onMouseOver.bind(this, this.props.card)}
                        onMouseOut={this.props.disableMouseOver ? null : this.onMouseOut}
                        onClick={ev => this.onClick(ev, this.props.card, this.props.source)}
                        onDragStart={ev => this.onCardDragStart(ev, this.props.card, this.props.source)}
                        draggable>
                        <div>
                            <span className='card-name'>{this.props.card.name}</span>
                            <img className={imageClass} src={'/img/cards/' + (!this.isFacedown() ? (this.props.card.code + '.png') : 'cardback.jpg')} />
                        </div>
                        {this.getCounters()}
                    </div>
                    {this.getMenu()}
                </div>);
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
        kneeled: React.PropTypes.bool,
        menu: React.PropTypes.array,
        name: React.PropTypes.string,
        new: React.PropTypes.bool,
        power: React.PropTypes.number,
        selected: React.PropTypes.bool,
        strength: React.PropTypes.number,
        tokens: React.PropTypes.object,
        type: React.PropTypes.string
    }).isRequired,
    className: React.PropTypes.string,
    disableMouseOver: React.PropTypes.bool,
    horizontal: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onMenuItemClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    source: React.PropTypes.oneOf(['hand', 'discard pile', 'play area', 'dead pile', 'draw deck', 'plot deck', 'revealed plots', 'selected plot', 'attachment', 'agenda', 'faction']).isRequired,
    style: React.PropTypes.object,
    wrapped: React.PropTypes.bool
};
Card.defaultProps = {
    wrapped: true
};

export default Card;
