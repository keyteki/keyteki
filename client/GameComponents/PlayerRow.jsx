import React from 'react';
import _ from 'underscore';

class PlayerRow extends React.Component {
    constructor() {
        super();

        this.onPlotDeckClick = this.onPlotDeckClick.bind(this);

        this.state = {
            showPlotDeck: false
        };
    }

    onPlotDeckClick() {
        this.setState({ showPlotDeck: !this.state.showPlotDeck });
    }

    onPlotCardClick(event, card) {
        event.preventDefault();
        event.stopPropagation();

        this.setState({ selectedPlot: card });

        if(this.props.onPlotCardSelected) {
            this.props.onPlotCardSelected(card);
        }
    }

    render() {
        var cardIndex = 0;

        var hand = _.map(this.props.hand, card => {
            var retCard = (
                <div key={ cardIndex.toString() + card.code } className='card' onMouseOver={ this.props.onMouseOver ? this.props.onMouseOver.bind(this, card) : null } onMouseOut={ this.props.onMouseOut }
                    onClick={ this.props.isMe ? () => this.props.onCardClick(card) : null }>
                    <img src={ '/img/cards/' + (card.code ? (card.code + '.png') : 'cardback.jpg') } />
                </div>);
            cardIndex++;

            return retCard;
        });

        cardIndex = 0;
        var plotDeck = _.map(this.props.plotDeck, card => {
            var plotClass = 'plot-card';

            if(card === this.state.selectedPlot) {
                plotClass += ' selected';
            }

            var plotCard = (<div key={ 'card' + cardIndex.toString() } className={ plotClass } onMouseOver={ this.props.onMouseOver ? this.props.onMouseOver.bind(this, card) : null }
                onMouseOut={ this.props.onMouseOut } onClick={ (event) => this.onPlotCardClick(event, card) }>
                <img src={ '/img/cards/' + card.code + '.png' } />
            </div>);

            cardIndex++;

            return plotCard;
        });

        return (
            <div className='player-home-row'>
                <div className='panel hand'>
                    { hand }
                </div>
                <div className='discard panel' />
                <div className='draw panel'>
                    <div className='card'>
                        <img src='/img/cards/cardback.jpg' />
                    </div>
                </div>
                <div className='faction panel'>
                    <div className='card'>
                        { this.props.faction ? <img src={ '/img/factions/' + this.props.faction.value + '.png' } /> : null }
                    </div>
                </div>
                { this.props.agenda ?
                    <div className='agenda panel' onMouseOver={ this.props.onMouseOver ? this.props.onMouseOver.bind(this, this.props.agenda) : null }
                        onMouseOut={ this.props.onMouseOut ? this.props.onMouseOut : null }>
                        <img src={ '/img/cards/' + this.props.agenda.code + '.png' } />
                    </div>
                    : <div className='agenda panel' />
                }
                <div className={ 'plot ' + (this.isMe ? 'our-side ' : '') + 'panel' } onClick={ this.onPlotDeckClick }>
                    <img src='/img/cards/cardback.jpg' />

                    { this.state.showPlotDeck ? <div className='panel plot-popup'>
                        { plotDeck }
                    </div> : null }
                </div>
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
    onCardClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    onPlotCardSelected: React.PropTypes.func,
    plotDeck: React.PropTypes.array
};

export default PlayerRow;
