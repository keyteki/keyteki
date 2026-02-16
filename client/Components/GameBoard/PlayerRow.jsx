import React from 'react';
import { useTranslation } from 'react-i18next';
import Droppable from './Droppable';
import SquishableCardPanel from './SquishableCardPanel';

const PlayerRow = ({
    cardBack,
    cardSize,
    hasActiveHouse,
    hand,
    isMe,
    isSpectating,
    isActivePlayer,
    manualMode,
    onCardClick,
    onDragDrop,
    onMouseOut,
    onMouseOver
}) => {
    const { t } = useTranslation();

    let sortedHand = [].concat(hand).sort((a, b) => {
        if (a.printedHouse < b.printedHouse) {
            return -1;
        } else if (a.printedHouse > b.printedHouse) {
            return 1;
        }

        return 0;
    });

    let handToRender = (
        <SquishableCardPanel
            cards={sortedHand}
            className='panel hand'
            groupVisibleCards
            cardBack={cardBack}
            manualMode={manualMode}
            maxCards={5}
            onCardClick={onCardClick}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
            source='hand'
            title={t('Hand')}
            cardSize={cardSize}
            hasActiveHouse={hasActiveHouse}
            isMe={isMe}
            isSpectating={isSpectating}
        />
    );

    return isMe ? (
        <div className={`player-home-row-container pt-1${isActivePlayer ? '' : ' inactive-turn'}`}>
            <Droppable onDragDrop={onDragDrop} source='hand' manualMode={manualMode}>
                {handToRender}
            </Droppable>
        </div>
    ) : null;
};

PlayerRow.displayName = 'PlayerRow';

export default PlayerRow;
