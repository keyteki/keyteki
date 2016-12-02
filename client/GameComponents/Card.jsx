import React from 'react';
import _ from 'underscore';

class Card extends React.Component {
    constructor() {
        super();

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
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

    onClick(event, card, source) {
        event.preventDefault();
        event.stopPropagation();

        if(this.props.onClick) {
            this.props.onClick(source, card);
        }
    }

    getCounters() {
        var counters = {};

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

        return (
            <div className='counters ignore-mouse-events'>
                {counterDivs}
            </div>);
    }

    isFacedown() {
        return this.props.card.facedown || !this.props.card.code;
    }

    render() {
        var cardClass = '';
        var imageClass = '';
        
        if(this.props.card.kneeled) {
            cardClass = 'horizontal-card';
            imageClass = 'kneeled card';
        } else if(this.props.card.type === 'plot') {
            cardClass = 'plot-card';
            imageClass = 'plot-card';
        } else {
            cardClass = 'card';
            imageClass = 'card';
        }

        if(this.props.card.new) {
            cardClass += ' new';
        } else if(this.props.card.selected) {
            cardClass += ' selected';
        }

        var offset = 10;
        var attachments = _.map(this.props.card.attachments, attachment => {
            var style = { top: offset + 'px', zIndex: -offset };

            var returnedAttachment = (<Card key={attachment.uuid} style={style} source={this.props.source} card={attachment}
                            onMouseOver={this.props.disableMouseOver ? null : this.onMouseOver.bind(this, attachment)}
                            onMouseOut={this.props.disableMouseOver ? null : this.onMouseOut}
                            onClick={ev => this.onClick(ev, attachment, this.props.source)}
                            onDragStart={ev => this.onCardDragStart(ev, attachment, this.props.source)}
                            draggable />);

            offset += 10;

            return returnedAttachment;
        });

        return (
                <div className={'card-wrapper' + (this.props.card.type === 'attachment' ? ' attachment' : '')} style={this.props.style}>
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
                            { this.getCounters() }
                        </div>
                        {attachments}
                    </div>
                </div>);
    }
}

Card.displayName = 'Card';
Card.propTypes = {
    card: React.PropTypes.shape({
        attachments: React.PropTypes.array,
        baseStrength: React.PropTypes.number,
        code: React.PropTypes.string,
        dupes: React.PropTypes.array,
        facedown: React.PropTypes.bool,
        kneeled: React.PropTypes.bool,
        name: React.PropTypes.string,
        new: React.PropTypes.bool,
        power: React.PropTypes.number,
        selected: React.PropTypes.bool,
        strength: React.PropTypes.number,
        tokens: React.PropTypes.object,
        type: React.PropTypes.string
    }).isRequired,
    disableMouseOver: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    source: React.PropTypes.oneOf(['hand', 'discard pile', 'play area', 'dead pile', 'draw deck', 'plot deck', 'attachment']).isRequired,
    style: React.PropTypes.object
};

export default Card;
