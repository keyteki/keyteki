import React from 'react';
import classNames from 'classnames';

import CardTiledList from './CardTiledList';
import Droppable from './Droppable';
import MovablePanel from './MovablePanel';
import { Constants } from '../../constants';

const CardPilePopup = ({
    cardBack,
    cards,
    disableMouseOver,
    hasActiveHouse,
    houses,
    isMe,
    isSpectating,
    manualMode,
    onCardClick,
    onCloseClick,
    onDragDrop,
    onMouseOut,
    onMouseOver,
    onTouchMove,
    popupLocation,
    popupMenu,
    size,
    source,
    title
}) => {
    let popup = null;
    let cardList = [];

    let listProps = {
        cardBack,
        disableMouseOver,
        manualMode,
        onCardClick,
        onCardMouseOut: onMouseOut,
        onCardMouseOver: onMouseOver,
        onTouchMove,
        hasActiveHouse,
        isMe,
        isSpectating,
        size,
        source
    };

    if (cards && cards.some((card) => card.group)) {
        const cardGroup = cards.reduce((grouping, card) => {
            (grouping[card.group] = grouping[card.group] || []).push(card);

            return grouping;
        }, {});
        const sortedKeys = Object.keys(cardGroup).sort();
        for (const key of sortedKeys) {
            cardList.push(
                <CardTiledList cards={cardGroup[key]} key={key} title={key} {...listProps} />
            );
        }
    } else {
        cardList = <CardTiledList cards={cards} {...listProps} />;
    }

    let popupClass = classNames('card-pile-popup', {
        'our-side': popupLocation === 'bottom',
        [size]: true
    });

    let innerClass = classNames('inner', {
        [size]: true,
        [source]: true
    });
    let linkIndex = 0;

    let popupMenuToRender = popupMenu && (
        <div>
            {popupMenu.map((menuItem) => {
                return (
                    <button
                        type='button'
                        className='mb-2 mr-2 inline-flex items-center rounded-md border border-border/70 bg-surface-secondary/55 px-2.5 py-1.5 text-xs text-foreground transition hover:bg-surface-secondary/75'
                        key={linkIndex++}
                        onClick={() => {
                            menuItem.handler && menuItem.handler();

                            onCloseClick();
                        }}
                    >
                        {menuItem.text}
                    </button>
                );
            })}
        </div>
    );

    let popupTitle = title;
    if (houses && houses.length > 0 && cards) {
        const ownedCards = cards.filter((card) => !card.controlled);
        const hasHiddenCards = ownedCards.some((card) => card.facedown);
        const ownedVisible = ownedCards.filter((card) => !card.facedown);
        const counts = houses.map((house) => ({
            house,
            count: hasHiddenCards
                ? '?'
                : ownedVisible.filter((card) => card.printedHouse === house).length
        }));

        popupTitle = (
            <span className='inline-flex items-center gap-2'>
                <span>{title}</span>
                {counts.map(({ house, count }) => (
                    <span key={house} className='inline-flex items-center gap-0.5'>
                        <img
                            src={Constants.IdBackHousePaths[house]}
                            alt={house}
                            className='inline-block h-4 w-4'
                        />
                        <span className='text-sm'>{count}</span>
                    </span>
                ))}
            </span>
        );
    }

    popup = (
        <MovablePanel
            size={size}
            title={popupTitle}
            name={source}
            onCloseClick={onCloseClick}
            side={popupLocation}
        >
            <Droppable onDragDrop={onDragDrop} source={source} manualMode={manualMode}>
                <div className={popupClass} onClick={(event) => event.stopPropagation()}>
                    {popupMenuToRender}
                    <div className={innerClass}>{cardList}</div>
                </div>
            </Droppable>
        </MovablePanel>
    );

    return popup;
};

export default CardPilePopup;
