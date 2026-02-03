import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Card from './Card';
import PlayerRow from './PlayerRow';
import Droppable from './Droppable';

import './PlayerBoard.scss';

const PlayerBoard = (props) => {
    const rows = useMemo(() => {
        const cardsInPlay = props.cardsInPlay || [];
        const groupedCards = cardsInPlay.reduce((group, card) => {
            (group[card.type] = group[card.type] || []).push(card);
            return group;
        }, {});

        const artifacts = groupedCards['artifact'] || [];
        const creatures = groupedCards['creature'] || [];
        let other = [];

        for (let key of Object.keys(groupedCards).filter(
            (k) => !['artifact', 'creature'].includes(k)
        )) {
            other = other.concat(groupedCards[key]);
        }

        if (props.rowDirection === 'reverse') {
            return [
                ...(other.length > 0 ? [{ name: 'other', cards: other }] : []),
                { name: 'artifacts', cards: artifacts },
                { name: 'creatures', cards: creatures }
            ];
        }

        return [
            { name: 'creatures', cards: creatures },
            { name: 'artifacts', cards: artifacts },
            ...(other.length > 0 ? [{ name: 'other', cards: other }] : [])
        ];
    }, [props.cardsInPlay, props.rowDirection]);

    const className = classNames('player-board', {
        'our-side': props.rowDirection === 'default',
        player: props.isMe,
        'board-high-tide': props.tide === 'high',
        'board-low-tide': props.tide === 'low'
    });

    return (
        <div className={className}>
            <Droppable
                onDragDrop={props.onDragDrop}
                source='play area'
                manualMode={props.manualMode}
            >
                {rows.map((row, index) => (
                    <div className={`card-row ${row.name}`} key={`card-row-${index}`}>
                        {row.cards.map((card) => (
                            <Card
                                key={card.uuid}
                                cardBack={props.cardBack}
                                canDrag={props.manualMode}
                                card={card}
                                disableMouseOver={card.facedown && !card.code}
                                halfSize={props.user.settings.optionSettings.useHalfSizedCards}
                                isSpectating={props.isSpectating}
                                onClick={props.onCardClick}
                                onMenuItemClick={props.onMenuItemClick}
                                onMouseOut={props.onMouseOut}
                                onMouseOver={props.onMouseOver}
                                size={props.user.settings.cardSize}
                                source='play area'
                            />
                        ))}
                    </div>
                ))}
            </Droppable>
            {props.isMe && (
                <PlayerRow
                    cardBack={props.cardBack}
                    cardSize={props.cardSize}
                    hand={props.hand}
                    isMe={props.isMe}
                    manualMode={props.manualMode}
                    onCardClick={props.onCardClick}
                    onDragDrop={props.onDragDrop}
                    onMouseOut={props.onMouseOut}
                    onMouseOver={props.onMouseOver}
                />
            )}
        </div>
    );
};

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
