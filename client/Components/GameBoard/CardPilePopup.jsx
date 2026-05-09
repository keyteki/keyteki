import React from 'react';
import classNames from 'classnames';

import CardTiledList from './CardTiledList';
import Droppable from './Droppable';
import MovablePanel from './MovablePanel';

const CardPilePopup = ({
    cardBack,
    cards,
    disableMouseOver,
    hasActiveHouse,
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

    popup = (
        <MovablePanel
            size={size}
            title={title}
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
