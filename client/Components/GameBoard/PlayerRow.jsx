import React from 'react';
import { useTranslation } from 'react-i18next';

import CardPile from './CardPile';
import DrawDeck from './DrawDeck';
import Droppable from './Droppable';
import Keys from './Keys';
import SquishableCardPanel from './SquishableCardPanel';

import './PlayerRow.scss';

const PlayerRow = ({
    archives,
    cardSize,
    cardBack,
    deckList,
    discard,
    drawDeck,
    isMe,
    hand,
    keys,
    manualMode,
    numDeckCards,
    onCardClick,
    onDragDrop,
    onDrawPopupChange,
    onMouseOut,
    onMouseOver,
    onShuffleClick,
    purgedPile,
    showDeck,
    side,
    spectating,
    username
}) => {
    const { t } = useTranslation();

    const renderDroppablePile = (source, child) => {
        return isMe ? (
            <Droppable onDragDrop={onDragDrop} source={source} manualMode={manualMode}>
                {child}
            </Droppable>
        ) : (
            child
        );
    };

    let cardPileProps = {
        cardBack: cardBack,
        manualMode: manualMode,
        onCardClick: onCardClick,
        onDragDrop: onDragDrop,
        onMouseOut: onMouseOut,
        onMouseOver: onMouseOver,
        popupLocation: side,
        size: cardSize
    };

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
            username={username}
            manualMode={manualMode}
            maxCards={5}
            onCardClick={onCardClick}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
            source='hand'
            title={t('Hand')}
            cardSize={cardSize}
        />
    );

    let drawDeckToRender = (
        <DrawDeck
            cardCount={numDeckCards}
            cards={drawDeck}
            isMe={isMe}
            manualMode={manualMode}
            numDeckCards={numDeckCards}
            onPopupChange={onDrawPopupChange}
            onShuffleClick={onShuffleClick}
            showDeck={showDeck}
            spectating={spectating}
            {...cardPileProps}
        />
    );

    let hasArchivedCards = archives?.length > 0;
    let archivesToRender = (
        <CardPile
            className='archives'
            title={t('Archives')}
            source='archives'
            cards={archives}
            hiddenTopCard={hasArchivedCards && !isMe}
            {...cardPileProps}
        />
    );

    let discardToRender = (
        <CardPile
            className='discard'
            title={t('Discard')}
            source='discard'
            cards={discard}
            {...cardPileProps}
        />
    );

    let purged = (
        <CardPile
            className='purged'
            title={t('Purged')}
            source='purged'
            cards={purgedPile}
            {...cardPileProps}
        />
    );

    return (
        <div className='player-home-row-container pt-1'>
            {<Keys cardSize={cardSize} keys={keys} manualMode={manualMode} />}
            {renderDroppablePile('hand', handToRender)}
            {renderDroppablePile('archives', archivesToRender)}
            {deckList}
            {renderDroppablePile('deck', drawDeckToRender)}
            {renderDroppablePile('discard', discardToRender)}
            {(purgedPile.length > 0 || manualMode) && renderDroppablePile('purged', purged)}
        </div>
    );
};

PlayerRow.displayName = 'PlayerRow';

export default PlayerRow;
