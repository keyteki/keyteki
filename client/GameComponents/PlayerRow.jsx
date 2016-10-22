import React from 'react';
import _ from 'underscore';

class PlayerRow extends React.Component {
    constructor() {
        super();

        this.onHandDrop = this.onHandDrop.bind(this);

        this.state = {
            showPlotDeck: false
        };
    }

    onCardDragStart(event, card) {
        event.dataTransfer.setData('card', JSON.stringify(card));
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onHandDrop(event) {
        event.stopPropagation();
        event.preventDefault();

        var card = JSON.parse(event.dataTransfer.getData('card'));

        if(this.props.onHandDrop) {
            this.props.onHandDrop(card);
        }
    }

    render() {
        var cardIndex = 0;
        var className = 'panel hand';

        if(this.props.hand.length * 64 > 342) {
            className += ' squish';
        }

        var requiredWidth = this.props.hand.length * 64;
        var overflow = requiredWidth - 342;
        var offset = overflow / (this.props.hand.length - 1);

        var hand = _.map(this.props.hand, card => {
            var left = (64 - offset) * cardIndex;

            var style = {
                left: left + 'px'
            };

            var retCard = (
                <div className='card-wrapper' style={style}>
                    <div className='card-frame'>
                        <div key={cardIndex.toString() + card.code} className='card'
                            onMouseOver={this.props.onMouseOver ? this.props.onMouseOver.bind(this, card) : null}
                            onMouseOut={this.props.onMouseOut}
                            onClick={this.props.isMe ? () => this.props.onCardClick(card) : null}>
                            <div>
                                <span className='card-name'>{card.label}</span>
                                <img className='card' src={'/img/cards/' + (card.code ? (card.code + '.png') : 'cardback.jpg')} />
                            </div>
                        </div>
                    </div>
                </div>);
            cardIndex++;

            return retCard;
        });

        var drawDeckPopup = undefined;

        if(this.props.showDrawDeck && this.props.drawDeck) {
            var drawDeck = _.map(this.props.drawDeck, card => {
                return (
                    <div draggable className='card-frame' onDragStart={(ev) => this.onCardDragStart(ev, card)}>
                        <div className='card' onMouseOver={this.props.onMouseOver.bind(this, card)} onMouseOut={this.props.onMouseOut}>
                            <div>
                                <img className='card' src={'/img/cards/' + card.code + '.png'} />}
                            </div>
                        </div>
                    </div>);
            });

            drawDeckPopup = <div className='panel popup'>{drawDeck}</div>;
        }

        var powerCounters = this.props.power > 0 ? (
            <div className='counters'>
                <div className='counter power'>
                    {this.props.power}
                </div>
            </div>) : null;

        return (
            <div className='player-home-row'>
                <div className={className} onDragOver={this.onDragOver} onDrop={this.onHandDrop}>
                    <div className='panel-header'>
                        {'Hand (' + hand.length + ')'}
                    </div>
                    {hand}
                </div>
                <div className='discard panel'>
                    <div className='panel-header'>
                        {'Discard (0)'}
                    </div>
                </div>
                <div className='draw panel' onClick={this.props.isMe ? this.props.onDrawClick : null}>
                    <div className='panel-header'>
                        {'Draw (' + this.props.numDrawCards + ')'}
                    </div>
                    <div className='card'>
                        <img className='card' src='/img/cards/cardback.jpg' />
                    </div>
                    {drawDeckPopup}
                </div>
                <div className='faction panel'>
                    <div className='card'>
                        {this.props.faction ? <img className='card' src={'/img/factions/' + this.props.faction.value + '.png'} /> : null}
                    </div>
                    {powerCounters}
                </div>
                {this.props.agenda ?
                    <div className='agenda panel' onMouseOver={this.props.onMouseOver ? this.props.onMouseOver.bind(this, this.props.agenda) : null}
                        onMouseOut={this.props.onMouseOut ? this.props.onMouseOut : null}>
                        <img className='card' src={'/img/cards/' + this.props.agenda.code + '.png'} />
                    </div>
                    : <div className='agenda panel' />
                }
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    agenda: React.PropTypes.object,
    drawDeck: React.PropTypes.array,
    faction: React.PropTypes.object,
    hand: React.PropTypes.array,
    isMe: React.PropTypes.bool,
    numDrawCards: React.PropTypes.number,
    onCardClick: React.PropTypes.func,
    onDrawClick: React.PropTypes.func,
    onHandDrop: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    onPlotCardSelected: React.PropTypes.func,
    plotDeck: React.PropTypes.array,
    power: React.PropTypes.number,
    showDrawDeck: React.PropTypes.bool
};

export default PlayerRow;
