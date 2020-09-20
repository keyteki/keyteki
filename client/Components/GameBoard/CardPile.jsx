import React from 'react';
import classNames from 'classnames';

import Card from './Card';
import CardPilePopup from './CardPilePopup';

import './CardPile.scss';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';

const CardPile = ({
    cardBackUrl,
    cards,
    cardCount,
    className,
    closeOnClick,
    disableMouseOver,
    disablePopup,
    hiddenTopCard,
    manualMode,
    onCardClick,
    onDragDrop,
    onMenuItemClick,
    onMouseOut,
    onMouseOver,
    onPopupChange,
    onTouchMove,
    orientation = 'vertical',
    popupLocation = 'bottom',
    popupMenu,
    size,
    source,
    title,
    topCard
}) => {
    const [showPopup, setShowPopup] = useState(false);
    const updatePopupVisibility = useCallback(
        (value) => {
            setShowPopup(value);

            onPopupChange && onPopupChange({ source: source, visible: value });
        },
        [source, onPopupChange]
    );

    console.info('merp');

    useEffect(() => {
        console.info('hi');
        if (cards?.some((card) => card.selectable)) {
            updatePopupVisibility(true);
        } else {
            updatePopupVisibility(false);
        }
    }, [cards, updatePopupVisibility]);

    const isTopCardSelectable = () => {
        if (!topCard) {
            return false;
        }

        return topCard.selectable && (!cards || cards.every((card) => card.unselectable));
    };

    const onTopCardClick = () => {
        if (disablePopup || isTopCardSelectable()) {
            if (onCardClick && topCard) {
                onCardClick(topCard);
            }

            return;
        }

        updatePopupVisibility(!showPopup);
    };

    let classNameStr = classNames('panel', 'card-pile', className, {
        [size]: size !== 'normal',
        horizontal: orientation === 'horizontal' || orientation === 'exhausted',
        vertical: orientation === 'vertical'
    });

    let cardCountStr = cardCount || (cards ? cards.length : '0');
    let headerText = title ? `${title} (${cardCountStr})` : '';
    let topCardToRender = topCard || (cards ? cards[0] : null);
    let cardOrientation =
        orientation === 'horizontal' && topCard && topCard.facedown ? 'exhausted' : orientation;

    if (hiddenTopCard && !topCard) {
        topCard = { facedown: true };
    }

    return (
        <div
            className={classNameStr}
            onClick={() => {
                if (!disablePopup) {
                    updatePopupVisibility(!showPopup);
                }
            }}
        >
            <div className='panel-header'>{headerText}</div>
            {topCard ? (
                <Card
                    cardBackUrl={cardBackUrl}
                    canDrag={manualMode}
                    card={topCardToRender}
                    source={source}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    disableMouseOver={hiddenTopCard}
                    onClick={onTopCardClick}
                    onMenuItemClick={onMenuItemClick}
                    orientation={cardOrientation}
                    size={size}
                />
            ) : (
                <div className='card-placeholder' />
            )}
            <CardPilePopup
                cardBackUrl={cardBackUrl}
                cards={cards}
                disableMouseOver={disableMouseOver}
                disablePopup={disablePopup}
                manualMode={manualMode}
                onCardClick={() => {
                    if (closeOnClick) {
                        updatePopupVisibility(false);
                    }
                }}
                onCloseClick={updatePopupVisibility(!showPopup)}
                onDragDrop={onDragDrop}
                onMouseOut={onMouseOut}
                onMouseOver={onMouseOver}
                onTouchMove={onTouchMove}
                popupLocation={popupLocation}
                popupMenu={popupMenu}
                size={size}
                source={source}
                title={title}
            />
        </div>
    );
};

CardPile.displayName = 'CardPile';
CardPile.defaultProps = {
    popupLocation: 'bottom',
    orientation: 'vertical'
};

export default CardPile;
