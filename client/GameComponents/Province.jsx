import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import Card from './Card.jsx';
import {tryParseJSON} from '../util.js';

class Province extends React.Component {
    constructor() {
        super();

        this.onDragDrop = this.onDragDrop.bind(this);

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

    render() {
        var className = 'panel province ' + this.props.className;
        var cardCount = this.props.cardCount || (this.props.cards ? this.props.cards.length : '0');
        var headerText = this.props.title ? this.props.title + ' (' + (cardCount) + ')' : '';
        var provinceCard = this.props.provinceCard || _.find(this.props.cards, card => {
            return card.isProvince;
        });
        var dynastyCard = this.props.dynastyCard || _.find(this.props.cards, card => {
            return card.isDynasty;
        });
        var strongholdCard = this.props.strongholdCard || _.find(this.props.cards, card => {
            return card.isStronghold;
        });
        var cardOrientation = this.props.orientation === 'horizontal' && provinceCard && provinceCard.facedown ? 'bowed' : this.props.orientation;

        if(this.props.hiddenProvinceCard && provinceCard) {
            provinceCard.facedown = true;
        }

        if(this.props.hiddenDynastyCard && dynastyCard) {
            dynastyCard.facedown = true;
        }

        if(this.props.orientation === 'horizontal' || this.props.orientation === 'bowed') {
            className += ' horizontal';
        } else {
            className += ' vertical';
        }

        return (
            <div className={ className } onDragLeave={ this.onDragLeave } onDragOver={ this.onDragOver } onDrop={ event => this.onDragDrop(event, this.props.source) }
                onClick={ this.onCollectionClick }>
                <div className='panel-header'>
                    { headerText }
                </div>
                { provinceCard ? <Card card={ provinceCard } source={ this.props.source }
                    onMouseOver={ this.props.onMouseOver }
                    onMouseOut={ this.props.onMouseOut }
                    disableMouseOver={ provinceCard.facedown }
                    onClick={ this.props.onCardClick }
                    onMenuItemClick={ this.props.onMenuItemClick }
                    onDragDrop={ this.props.onDragDrop }
                    orientation={ cardOrientation } /> : null }
                { dynastyCard ? <Card className='province-attachment' card={ dynastyCard } source={ this.props.source }
                    onMouseOver={ this.props.onMouseOver }
                    onMouseOut={ this.props.onMouseOut }
                    disableMouseOver={ dynastyCard.facedown }
                    onClick={ this.props.onCardClick }
                    onMenuItemClick={ this.props.onMenuItemClick }
                    onDragDrop={ this.props.onDragDrop }
                    orientation={ cardOrientation } /> : null }
                { strongholdCard ? <Card className='province-attachment' card={ strongholdCard } source={ this.props.source }
                    onMouseOver={ this.props.onMouseOver }
                    onMouseOut={ this.props.onMouseOut }
                    disableMouseOver={ strongholdCard.facedown }
                    onClick={ this.props.onCardClick }
                    onMenuItemClick={ this.props.onMenuItemClick }
                    onDragDrop={ this.props.onDragDrop }
                    orientation={ cardOrientation } /> : null }
            </div>);
    }
}

Province.displayName = 'Province';
Province.propTypes = {
    cardCount: React.PropTypes.number,
    cards: React.PropTypes.array,
    className: React.PropTypes.string,
    disableMouseOver: React.PropTypes.bool,
    disablePopup: React.PropTypes.bool,
    dynastyCard: React.PropTypes.object,
    hiddenDynastyCard: React.PropTypes.bool,
    hiddenProvinceCard: React.PropTypes.bool,
    isBroken: React.PropTypes.bool,
    isMe: React.PropTypes.bool,
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
    provinceCard: React.PropTypes.object,
    showDynastyRow: React.PropTypes.bool,
    source: React.PropTypes.oneOf(['stronghold province', 'province 1', 'province 2', 'province 3', 'province 4']).isRequired,
    strongholdCard: React.PropTypes.object,
    title: React.PropTypes.string
};
Province.defaultProps = {
    orientation: 'vertical'
};

export default Province;
