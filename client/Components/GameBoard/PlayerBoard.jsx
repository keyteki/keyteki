import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from './Card';
import PlayerRow from './PlayerRow';
import Droppable from './Droppable';

import './PlayerBoard.scss';

const PlayerBoard = ({
    cardsInPlay,
    cardBack,
    cardSize,
    hand,
    isMe,
    isSpectating,
    manualMode,
    onCardClick,
    onDragDrop,
    onMenuItemClick,
    onMouseOut,
    onMouseOver,
    rowDirection = 'default',
    tide,
    user
}) => {
    const getCardRows = useCallback(() => {
        let groupedCards = cardsInPlay.reduce((group, card) => {
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

        if (rowDirection === 'reverse') {
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
    }, [cardsInPlay, rowDirection]);

    const renderRow = useCallback(
        (row) => {
            return row.map((card) => (
                <Card
                    key={card.uuid}
                    cardBack={cardBack}
                    canDrag={manualMode}
                    card={card}
                    disableMouseOver={card.facedown && !card.code}
                    halfSize={user.settings.optionSettings.useHalfSizedCards}
                    isSpectating={isSpectating}
                    onClick={onCardClick}
                    onMenuItemClick={onMenuItemClick}
                    onMouseOut={onMouseOut}
                    onMouseOver={onMouseOver}
                    size={user.settings.cardSize}
                    source='play area'
                />
            ));
        },
        [
            cardBack,
            manualMode,
            user.settings.optionSettings.useHalfSizedCards,
            user.settings.cardSize,
            isSpectating,
            onCardClick,
            onMenuItemClick,
            onMouseOut,
            onMouseOver
        ]
    );

    const renderRows = useCallback(
        (rows) => {
            return rows.map((row, index) => (
                <div className={`card-row ${row.name}`} key={`card-row-${index}`}>
                    {renderRow(row.cards)}
                </div>
            ));
        },
        [renderRow]
    );

    const rows = useMemo(() => getCardRows(), [getCardRows]);

    const className = classNames('player-board', {
        'our-side': rowDirection === 'default',
        player: isMe,
        'board-high-tide': tide === 'high',
        'board-low-tide': tide === 'low'
    });

    return (
        <div className={className}>
            <Droppable onDragDrop={onDragDrop} source='play area' manualMode={manualMode}>
                {renderRows(rows)}
            </Droppable>
            {isMe && (
                <PlayerRow
                    cardBack={cardBack}
                    cardSize={cardSize}
                    hand={hand}
                    isMe={isMe}
                    manualMode={manualMode}
                    onCardClick={onCardClick}
                    onDragDrop={onDragDrop}
                    onMouseOut={onMouseOut}
                    onMouseOver={onMouseOver}
                />
            )}
        </div>
    );
};

PlayerBoard.displayName = 'PlayerBoard';
PlayerBoard.propTypes = {
    cardBack: PropTypes.string,
    cardSize: PropTypes.string,
    cardsInPlay: PropTypes.array,
    hand: PropTypes.array,
    isMe: PropTypes.bool,
    isSpectating: PropTypes.bool,
    manualMode: PropTypes.bool,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    rowDirection: PropTypes.oneOf(['default', 'reverse']),
    tide: PropTypes.string,
    user: PropTypes.object
};

export default PlayerBoard;
