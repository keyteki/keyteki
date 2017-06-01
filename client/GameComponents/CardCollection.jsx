import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import Card from './Card.jsx';
import {tryParseJSON} from '../util.js';

class CardCollection extends React.Component {
    constructor() {
        super();

        this.onCollectionClick = this.onCollectionClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onTopCardClick = this.onTopCardClick.bind(this);

        this.state = {
            showPopup: false,
            showMenu: false
        };
    }

    onCollectionClick(event) {
        event.preventDefault();

        if(this.props.menu) {
            this.setState({ showMenu: !this.state.showMenu });
            return;
        }

        if(!this.props.disablePopup) {
            this.setState({ showPopup: !this.state.showPopup });
        }
    }

    onMenuItemClick(menuItem) {
        if(menuItem.showPopup) {
            this.setState({ showPopup: !this.state.showPopup });
        }

        menuItem.handler();
    }

    onPopupMenuItemClick(menuItem) {
        menuItem.handler();

        this.setState({ showPopup: !this.state.showPopup });
    }

    onTopCardClick() {
        if(this.props.menu) {
            this.setState({ showMenu: !this.state.showMenu });
            return;
        }

        if(this.props.disablePopup) {
            if(this.props.onCardClick) {
                this.props.onCardClick(this.props.topCard);
            }

            return;
        }

        this.setState({showPopup: !this.state.showPopup});
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

    getPopup() {
        let popup = null;
        let cardIndex = 0;

        let cardList = _.map(this.props.cards, card => {
            let cardKey = card.uuid || cardIndex++;
            return (<Card key={ cardKey } card={ card } source={ this.props.source }
                            disableMouseOver={ this.props.disableMouseOver }
                            onMouseOver={ this.props.onMouseOver }
                            onMouseOut={ this.props.onMouseOut }
                            onTouchMove={ this.props.onTouchMove }
                            onClick={ this.props.onCardClick }
                            onDragDrop={ this.props.onDragDrop }
                            orientation={ this.props.orientation } />);
        });

        let popupClass = 'popup panel';

        if(this.props.popupLocation === 'top') {
            popupClass += ' our-side';
        }

        let linkIndex = 0;

        var popupMenu = this.props.popupMenu ? (<div>{_.map(this.props.popupMenu, menuItem => {
            return <a key={ linkIndex++ } onClick={() => this.onPopupMenuItemClick(menuItem)}>{menuItem.text}</a>;
        })}</div>) : (
            <div>
                <a onClick={this.onCollectionClick}>Close</a>
            </div>);

        popup = (
            <div className={popupClass + (this.state.showPopup ? '' : ' hidden')} onClick={event => event.stopPropagation() }>
                {popupMenu}
                <div className='inner'>
                    {cardList}
                </div>
                <div className='arrow-indicator' />
            </div>);

        return popup;
    }

    getMenu() {
        var menuIndex = 0;

        var menu = _.map(this.props.menu, item => {
            return <div key={(menuIndex++).toString()} onClick={this.onMenuItemClick.bind(this, item)}>{item.text}</div>;
        });

        return (
            <div className='panel menu'>
                {menu}
            </div>);
    }

    render() {
        var className = 'panel card-pile ' + this.props.className;
        var cardCount = this.props.cardCount || (this.props.cards ? this.props.cards.length : '0');
        var headerText = this.props.title ? this.props.title + ' (' + (cardCount) + ')' : '';
        var topCard = this.props.topCard || _.last(this.props.cards);
        var cardOrientation = this.props.orientation === 'horizontal' && topCard && topCard.facedown ? 'bowed' : this.props.orientation;

        if(this.props.hiddenTopCard && topCard) {
            topCard.facedown = true;
        } else if(this.props.hiddenTopCard) {
            topCard = { facedown: true };
        }

        if(this.props.orientation === 'horizontal' || this.props.orientation === 'bowed') {
            className += ' horizontal';
        } else {
            className += ' vertical';
        }

        return (
            <div className={className} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={event => this.onDragDrop(event, this.props.source)}
                    onClick={this.onCollectionClick}>
                <div className='panel-header'>
                    {headerText}
                </div>
                {topCard ? <Card card={topCard} source={this.props.source}
                         onMouseOver={this.props.onMouseOver}
                         onMouseOut={this.props.onMouseOut}
                         disableMouseOver={topCard.facedown}
                         onClick={this.onTopCardClick}
                         onMenuItemClick={this.props.onMenuItemClick}
                         onDragDrop={this.props.onDragDrop}
                         orientation={cardOrientation} /> : null}
                {this.state.showMenu ? this.getMenu() : null}
                {this.getPopup()}
            </div>);
    }
}

CardCollection.displayName = 'CardCollection';
CardCollection.propTypes = {
    cardCount: React.PropTypes.number,
    cards: React.PropTypes.array,
    className: React.PropTypes.string,
    disableMouseOver: React.PropTypes.bool,
    disablePopup: React.PropTypes.bool,
    hiddenTopCard: React.PropTypes.bool,
    menu: React.PropTypes.array,
    onCardClick: React.PropTypes.func,
    onDragDrop: React.PropTypes.func,
    onMenuItemClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    onTouchMove: React.PropTypes.func,
    orientation: React.PropTypes.string,
    popupLocation: React.PropTypes.string,
    popupMenu: React.PropTypes.array,
    source: React.PropTypes.oneOf(['hand', 'conflict discard pile', 'dynasty discard pile', 'play area', 'conflict deck', 'dynasty deck', 'province deck', 'attachment', 'faction', 'stronghold province', 'additional']).isRequired,
    title: React.PropTypes.string,
    topCard: React.PropTypes.object
};
CardCollection.defaultProps = {
    orientation: 'vertical'
};

export default CardCollection;
