import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from './Card';
import PlayerRow from './PlayerRow';
import Droppable from './Droppable';

import './PlayerBoard.scss';

class PlayerBoard extends React.Component {
    getCardRows() {
        let groupedCards = this.props.cardsInPlay.reduce((group, card) => {
            (group[card.type] = group[card.type] || []).push(card);

            return group;
        }, {});

        let rows = [];
        let artifacts = groupedCards['artifact'] || [];
        let creatures = groupedCards['creature'] || [];
        let other = [];

        for (let key of Object.keys(groupedCards).filter(
            (k) => !['artifact', 'creature'].includes(k)
        )) {
            other = other.concat(groupedCards[key]);
        }

        if (this.props.rowDirection === 'reverse') {
            if (other.length > 0) {
                rows.push({ name: 'other', cards: other });
            }

            rows.push({ name: 'artifacts', cards: artifacts });
            rows.push({ name: 'creatures', cards: creatures });
        } else {
            rows.push({ name: 'creatures', cards: creatures });
            rows.push({ name: 'artifacts', cards: artifacts });
            if (other.length > 0) {
                rows.push({ name: 'other', cards: other });
            }
        }

        return rows;
    }

    renderRows(rows) {
        return rows.map((row, index) => (
            <div className={`card-row ${row.name}`} key={`card-row-${index}`}>
                {this.renderRow(row.cards)}
            </div>
        ));
    }

    renderRow(row) {
        return row.map((card) => (
            <Card
                key={card.uuid}
                cardBack={this.props.cardBack}
                canDrag={this.props.manualMode}
                card={card}
                disableMouseOver={!card.tokenCard && card.facedown && !card.code}
                halfSize={this.props.user.settings.optionSettings.useHalfSizedCards}
                isSpectating={this.props.isSpectating}
                onClick={this.props.onCardClick}
                onMenuItemClick={this.props.onMenuItemClick}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
                size={this.props.user.settings.cardSize}
                source='play area'
                tokenCard={card.tokenCard}
            />
        ));
    }

    render() {
        let rows = this.getCardRows();

        let className = classNames('player-board', {
            'our-side': this.props.rowDirection === 'default',
            player: this.props.isMe,
            'board-high-tide': this.props.tide === 'high',
            'board-low-tide': this.props.tide === 'low'
        });

        return (
            <div className={className}>
                <Droppable
                    onDragDrop={this.props.onDragDrop}
                    source='play area'
                    manualMode={this.props.manualMode}
                >
                    {this.renderRows(rows)}
                </Droppable>
                {this.props.isMe && (
                    <PlayerRow
                        cardBack={this.props.cardBack}
                        cardSize={this.props.cardSize}
                        hand={this.props.hand}
                        isMe={this.props.isMe}
                        manualMode={this.props.manualMode}
                        onCardClick={this.props.onCardClick}
                        onDragDrop={this.props.onDragDrop}
                        onMouseOut={this.props.onMouseOut}
                        onMouseOver={this.props.onMouseOver}
                    />
                )}
            </div>
        );
    }
}

PlayerBoard.displayName = 'PlayerBoard';
PlayerBoard.propTypes = {
    cardsInPlay: PropTypes.array,
    manualMode: PropTypes.bool,
    isSpectating: PropTypes.bool,
    onCardClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    rowDirection: PropTypes.oneOf(['default', 'reverse']),
    tide: PropTypes.string,
    user: PropTypes.object
};

export default PlayerBoard;
