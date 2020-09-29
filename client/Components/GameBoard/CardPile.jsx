import React from 'react';
import classNames from 'classnames';

import Card from './Card';
import CardPilePopup from './CardPilePopup';

import './CardPile.scss';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';

const CardPile = ({
    cardBack,
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
    title
}) => {
    const [showPopup, setShowPopup] = useState(false);
    const [manualPopup, setManualPopup] = useState(false);
    const updatePopupVisibility = useCallback(
        (value) => {
            setShowPopup(value);

            onPopupChange && onPopupChange({ source: source, visible: value });
        },
        [source, onPopupChange]
    );

    useEffect(() => {
        if (manualPopup) {
            return;
        }

        if (cards?.some((card) => card.selectable)) {
            updatePopupVisibility(true);
        } else {
            updatePopupVisibility(false);
        }
    }, [cards, manualPopup, updatePopupVisibility]);

    let classNameStr = classNames('panel', 'card-pile', className, {
        [size]: size !== 'normal',
        horizontal: orientation === 'horizontal' || orientation === 'exhausted',
        vertical: orientation === 'vertical'
    });

    let cardCountStr = cardCount || (cards ? cards.length : '0');
    let headerText = title ? `${title} (${cardCountStr})` : '';
    let topCard = cards ? cards[0] : null;
    let cardOrientation =
        orientation === 'horizontal' && topCard && topCard.facedown ? 'exhausted' : orientation;

    if (hiddenTopCard || !topCard) {
        topCard = { facedown: true };
    }

    return (
        <div
            className={classNameStr}
            onClick={() => {
                if (!disablePopup) {
                    updatePopupVisibility(!showPopup);
                    setManualPopup(!showPopup);
                }
            }}
        >
            <div className='panel-header'>{headerText}</div>
            {topCard ? (
                <Card
                    cardBack={cardBack}
                    canDrag={manualMode}
                    card={topCard}
                    source={source}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    disableMouseOver={hiddenTopCard}
                    onClick={() => {
                        updatePopupVisibility(!showPopup);
                        setManualPopup(!showPopup);
                    }}
                    onMenuItemClick={onMenuItemClick}
                    orientation={cardOrientation}
                    size={size}
                />
            ) : (
                <div className='card-placeholder' />
            )}
            {!disablePopup && showPopup && (
                <CardPilePopup
                    cardBack={cardBack}
                    cards={cards}
                    disableMouseOver={disableMouseOver}
                    manualMode={manualMode}
                    onCardClick={(card) => {
                        if (closeOnClick) {
                            updatePopupVisibility(false);
                            setManualPopup(false);
                        }

                        onCardClick && onCardClick(card);
                    }}
                    onCloseClick={() => {
                        updatePopupVisibility(!showPopup);
                        setManualPopup(!showPopup);
                    }}
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
            )}
        </div>
    );
};

CardPile.displayName = 'CardPile';
CardPile.defaultProps = {
    popupLocation: 'bottom',
    orientation: 'vertical'
};

export default CardPile;
