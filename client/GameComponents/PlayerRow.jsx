import React from 'react';
import _ from 'underscore';

class PlayerRow extends React.Component {
    constructor() {
        super();

        this.state = {
            showPlotDeck: false
        };
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

        return (
            <div className='player-home-row'>
                <div className={className}>
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
                <div className='draw panel'>
                    <div className='panel-header'>
                        {'Draw (' + this.props.numDrawCards + ')'}
                        </div>
                    <div className='card'>
                        <img className='card' src='/img/cards/cardback.jpg' />
                    </div>
                </div>
                <div className='faction panel'>
                    <div className='card'>
                        {this.props.faction ? <img className='card' src={'/img/factions/' + this.props.faction.value + '.png'} /> : null}
                    </div>
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
    faction: React.PropTypes.object,
    hand: React.PropTypes.array,
    isMe: React.PropTypes.bool,
    numDrawCards: React.PropTypes.number,
    onCardClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    onPlotCardSelected: React.PropTypes.func,
    plotDeck: React.PropTypes.array
};

export default PlayerRow;
