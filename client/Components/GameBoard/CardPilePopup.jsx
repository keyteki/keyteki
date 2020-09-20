import React from 'react';
import classNames from 'classnames';

import CardTiledList from './CardTiledList';
import Droppable from './Droppable';
import MovablePanel from './MovablePanel';

const CardPilePopup = ({
    cardBackUrl,
    cards,
    disableMouseOver,
    disablePopup,
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
        cardBackUrl: cardBackUrl,
        disableMouseOver: disableMouseOver,
        manualMode: manualMode,
        onCardClick: onCardClick,
        onCardMouseOut: onMouseOut,
        onCardMouseOver: onMouseOver,
        onTouchMove: onTouchMove,
        size: size,
        source: source
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

    if (disablePopup || !this.state.showPopup) {
        return null;
    }

    let popupClass = classNames('panel-body', {
        'our-side': popupLocation === 'bottom'
    });

    let innerClass = classNames('inner', size);
    let linkIndex = 0;

    let popupMenuToRender = popupMenu && (
        <div>
            {popupMenu.map((menuItem) => {
                return (
                    <a
                        className='btn btn-default'
                        key={linkIndex++}
                        onClick={() => {
                            menuItem.handler && menuItem.handler();

                            onCloseClick();
                        }}
                    >
                        {menuItem.text}
                    </a>
                );
            })}
        </div>
    );

    popup = (
        <MovablePanel title={title} name={source} onCloseClick={onCloseClick} side={popupLocation}>
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
