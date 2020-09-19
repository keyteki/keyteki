import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import CardPile from './CardPile';
import SquishableCardPanel from './SquishableCardPanel';
import DrawDeck from './DrawDeck';
import IdentityCard from './IdentityCard';
import Droppable from './Droppable';
import { buildArchon, buildDeckList } from '../../archonMaker';
import IdentityDefault from '../../assets/img/idbacks/identity.jpg';
import { setCardBack } from '../../redux/actions';

import './PlayerRow.scss';
import Keys from './Keys';

const PlayerRow = ({
    archives,
    cardBackUrl,
    cardSize,
    deckData,
    discard,
    drawDeck,
    isMe,
    gameFormat,
    hand,
    hideDeckLists,
    keys,
    language,
    manualMode,
    numDeckCards,
    onCardClick,
    onDragDrop,
    onDrawPopupChange,
    onMouseOut,
    onMouseOver,
    onShuffleClick,
    player,
    purgedPile,
    showDeck,
    side,
    spectating,
    username
}) => {
    const { t } = useTranslation();
    const [deckListUrl, setDeckListUrl] = useState(IdentityDefault);
    const cards = useSelector((state) => state.cards.cards);
    const deckDataCopy = { ...deckData };

    useEffect(() => {
        let noDeckLists = false;

        if ((gameFormat === 'sealed' && !isMe) || hideDeckLists) {
            deckDataCopy.name = '';
            noDeckLists = true;
        }

        buildArchon(deckData).then((cardBackUrl) => {
            setCardBack(player, cardBackUrl);
        });
        if (noDeckLists) {
            setDeckListUrl(IdentityDefault);
        } else {
            buildDeckList(deckDataCopy, language, t, cards)
                .then((deckListUrl) => {
                    setDeckListUrl(deckListUrl);
                })
                .catch(() => {
                    setDeckListUrl(IdentityDefault);
                });
        }
    }, [cards, deckData, gameFormat, hideDeckLists, isMe, language, player, t]);

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
            cardBackUrl={cardBackUrl}
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
            cardBackUrl={cardBackUrl}
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
            cardBackUrl={cardBackUrl}
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

    let identity = (
        <IdentityCard
            className='identity'
            deckListUrl={deckListUrl}
            size={cardSize}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
        />
    );

    return (
        <div className='player-home-row-container pt-1'>
            {<Keys cardSize={cardSize} keys={keys} manualMode={manualMode} />}
            {renderDroppablePile('hand', handToRender)}
            {renderDroppablePile('archives', archivesToRender)}
            {identity}
            {renderDroppablePile('deck', drawDeckToRender)}
            {renderDroppablePile('discard', discardToRender)}
            {purgedPile.length > 0 || (manualMode && renderDroppablePile('purged', purged))}
        </div>
    );
};

PlayerRow.displayName = 'PlayerRow';

export default PlayerRow;
