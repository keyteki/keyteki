import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from './Card';

import './PlayerBoard.scss';

class PlayerBoard extends React.Component {
    getCardRows() {
        let groupedCards = this.props.cardsInPlay.reduce((group, card) => {
            (group[card.type] = group[card.type] || []).push(card);

            return group;
        }, {});

        let rows = [];
        let locations = groupedCards['artifact'] || [];
        let characters = groupedCards['creature'] || [];
        let other = [];

        for (let key of Object.keys(groupedCards).filter(
            (k) => !['artifact', 'creature'].includes(k)
        )) {
            other = other.concat(groupedCards[key]);
        }

        if (this.props.rowDirection === 'reverse') {
            if (other.length > 0) {
                rows.push(other);
            }

            rows.push(locations);
            rows.push(characters);
        } else {
            rows.push(characters);
            rows.push(locations);
            if (other.length > 0) {
                rows.push(other);
            }
        }

        return rows;
    }

    renderRows(rows) {
        return rows.map((row, index) => (
            <div className='card-row' key={`card-row-${index}`}>
                {this.renderRow(row)}
            </div>
        ));
    }

    renderRow(row) {
        return row.map((card) => (
            <Card
                key={card.uuid}
                cardBackUrl={this.props.cardBackUrl}
                canDrag={this.props.manualMode}
                card={card}
                disableMouseOver={card.facedown && !card.code}
                onClick={this.props.onCardClick}
                onMenuItemClick={this.props.onMenuItemClick}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
                size={this.props.user.settings.cardSize}
                source='play area'
            />
        ));
    }

    render() {
        let rows = this.getCardRows();

        let className = classNames('player-board', {
            'our-side': this.props.rowDirection === 'default'
        });

        return <div className={className}>{this.renderRows(rows)}</div>;
    }
}

PlayerBoard.displayName = 'PlayerBoard';
PlayerBoard.propTypes = {
    cardBackUrl: PropTypes.string,
    cardsInPlay: PropTypes.array,
    manualMode: PropTypes.bool,
    onCardClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    rowDirection: PropTypes.oneOf(['default', 'reverse']),
    user: PropTypes.object
};

export default PlayerBoard;
