import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import CardPilePopup from './CardPilePopup';
import CardImage from './CardImage';

import './CardPileLink.scss';

const CardPileLink = ({
    cardBack,
    cards,
    className,
    closeOnClick,
    disableMouseOver,
    disablePopup,
    manualMode,
    numDeckCards,
    onCardClick,
    onDragDrop,
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

    let classNameStr = classNames('card-pile-link', className, {
        horizontal: orientation === 'horizontal' || orientation === 'exhausted',
        vertical: orientation === 'vertical'
    });

    const topCard = () => {
        if (cards.length === 0) {
            return;
        }
        let card = cards[0];
        if (!card.facedown && card.location !== 'deck') {
            return card;
        }
    };

    const card = topCard();

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
            {card && (
                <div
                    className='icon'
                    onMouseOver={() =>
                        onMouseOver({
                            image: (
                                <CardImage
                                    card={{ ...card, location: 'zoom' }}
                                    cardBack={cardBack}
                                />
                            ),
                            size: 'normal'
                        })
                    }
                    onMouseOut={onMouseOut}
                >
                    <CardImage card={card} orientation='vertical' size='icon' />
                </div>
            )}
            <div className={'text ' + title.toLowerCase()}>{title}:</div>&nbsp;
            <div className={'counter ' + title.toLowerCase()}>
                {source === 'deck' ? numDeckCards : cards.length}
            </div>
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

CardPileLink.displayName = 'CardPileLink';
export default CardPileLink;
