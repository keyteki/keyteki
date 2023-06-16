import React, { useState } from 'react';
import classNames from 'classnames';
import 'jquery-migrate';
import { useDrag } from 'react-dnd';

import CardMenu from './CardMenu';
import CardImage from './CardImage';
import { ItemTypes } from '../../constants';
import SquishableCardPanel from './SquishableCardPanel';

import './Card.scss';
import { useTranslation } from 'react-i18next';

const Card = ({
    canDrag,
    card,
    cardBack,
    className,
    disableMouseOver,
    halfSize,
    isSpectating,
    onClick,
    onMenuItemClick,
    onMouseOut,
    onMouseOver,
    orientation,
    size,
    source,
    style,
    tokenCard,
    wrapped
}) => {
    const { i18n } = useTranslation();

    const sizeClass = {
        [size]: size !== 'normal'
    };

    const [showMenu, setShowMenu] = useState(false);

    const [{ dragOffset, isDragging }, drag, preview] = useDrag({
        item: { card: card, source: source, type: ItemTypes.CARD },
        canDrag: () => canDrag || (!card.unselectable && card.canPlay),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            dragOffset: monitor.getSourceClientOffset()
        })
    });

    const isAllowedMenuSource = () => {
        return source === 'play area' && !isSpectating;
    };

    const onCardClicked = (event, card) => {
        event.preventDefault();
        event.stopPropagation();
        if (isAllowedMenuSource() && card.menu && card.menu.length !== 0) {
            setShowMenu(!showMenu);
            return;
        }

        onClick && onClick(card);
    };
    const getCardSizeMultiplier = () => {
        switch (size) {
            case 'small':
                return 0.6;
            case 'large':
                return 1.4;
            case 'x-large':
                return 2;
        }

        return 1;
    };

    const getupgrades = () => {
        if (!['full deck', 'play area'].includes(source) || !card.upgrades) {
            return null;
        }

        let upgrades = card.upgrades.map((upgrade, index) => {
            let returnedupgrade = (
                <Card
                    key={upgrade.uuid}
                    source={source}
                    card={upgrade}
                    className={classNames('upgrade', `upgrade-${index + 1}`)}
                    wrapped={false}
                    onMouseOver={
                        !disableMouseOver && onMouseOver
                            ? (upgrade) => onMouseOver(upgrade)
                            : undefined
                    }
                    onMouseOut={!disableMouseOver && onMouseOut}
                    onClick={onClick}
                    onMenuItemClick={onMenuItemClick}
                    size={size}
                    halfSize={halfSize}
                />
            );

            return returnedupgrade;
        });

        return upgrades;
    };

    const renderUnderneathCards = () => {
        // TODO: Right now it is assumed that all cards in the childCards array
        // are being placed underneath the current card. In the future there may
        // be other types of cards in this array and it should be filtered.
        let underneathCards = card.childCards;
        if (!underneathCards || underneathCards.length === 0) {
            return;
        }

        let maxCards = 1 + (underneathCards.length - 1) / 6;
        return (
            <SquishableCardPanel
                cardBack={cardBack}
                cardSize={size}
                cards={underneathCards}
                className='underneath'
                maxCards={maxCards}
                onCardClick={onClick}
                onMouseOut={onMouseOut}
                onMouseOver={onMouseOver}
                source='underneath'
            />
        );
    };

    const getCardOrdering = () => {
        if (!card.order) {
            return null;
        }

        return <div className='card-ordering'>{card.order}</div>;
    };

    const shouldShowMenu = () => {
        if (!isAllowedMenuSource()) {
            return false;
        }

        if (!card.menu || !showMenu) {
            return false;
        }

        return true;
    };

    const isFacedown = () => {
        return card.facedown || !card.name;
    };

    const getDragFrame = (image) => {
        if (!isDragging) {
            return null;
        }

        let style = {};
        if (dragOffset && isDragging) {
            let x = dragOffset.x;
            let y = dragOffset.y;
            style = {
                left: x,
                top: y
            };
        }

        return (
            <div className='drag-preview' style={style} ref={preview}>
                {image}
            </div>
        );
    };

    const getCardName = (card) => {
        if (i18n.language === 'en') {
            return card.name;
        }
        return card.locale && card.locale[i18n.language]
            ? card.locale[i18n.language].name
            : card.name;
    };

    const getCard = () => {
        if (!card) {
            return <div />;
        }

        let statusClass = getStatusClass();

        let cardClass = classNames(
            'game-card',
            `card-type-${card.type}`,
            className,
            sizeClass,
            halfSize ? 'halfSize' : '',
            statusClass,
            {
                'custom-card': card.code && card.code.startsWith('custom'),
                horizontal: orientation !== 'vertical' || card.exhausted,
                vertical: orientation === 'vertical' && !card.exhausted,
                'can-play':
                    statusClass !== 'selected' &&
                    statusClass !== 'selectable' &&
                    !card.unselectable &&
                    card.canPlay,
                unselectable: card.unselectable,
                dragging: isDragging,
                controlled: card.controlled,
                taunt: card.taunt && source === 'play area'
            }
        );
        let imageClass = classNames('card-image vertical', sizeClass, halfSize ? 'halfSize' : '', {
            exhausted: orientation === 'exhausted' || card.exhausted || orientation === 'horizontal'
        });
        let image = card ? (
            <div className={imageClass}>
                <CardImage
                    card={tokenCard || card}
                    cardBack={cardBack}
                    size={size}
                    halfSize={halfSize}
                />
            </div>
        ) : null;
        return (
            <div className='card-frame' ref={drag}>
                {getDragFrame(image)}
                {getCardOrdering()}
                <div
                    className={cardClass}
                    onMouseOver={
                        !disableMouseOver && (card.tokenCard || !isFacedown()) && onMouseOver
                            ? () =>
                                  onMouseOver({
                                      image: (
                                          <CardImage
                                              card={{
                                                  ...(isFacedown() ? card.tokenCard : card),
                                                  location: 'zoom'
                                              }}
                                              cardBack={cardBack}
                                          />
                                      ),
                                      size: 'normal'
                                  })
                            : undefined
                    }
                    onMouseOut={
                        !disableMouseOver && (card.tokenCard || !isFacedown())
                            ? onMouseOut
                            : undefined
                    }
                    onClick={(event) => onCardClicked(event, card)}
                >
                    <div>
                        <span className='card-name'>{getCardName(card)}</span>
                        {image}
                    </div>
                </div>
                {shouldShowMenu() && (
                    <CardMenu
                        menu={card.menu}
                        onMenuItemClick={(menuItem) => {
                            onMenuItemClick && onMenuItemClick(card, menuItem);
                            setShowMenu(!showMenu);
                        }}
                    />
                )}
            </div>
        );
    };

    const getStatusClass = () => {
        if (!card) {
            return undefined;
        }

        if (card.selected) {
            return 'selected';
        } else if (card.selectable) {
            return 'selectable';
        } else if (card.new) {
            return 'new';
        }

        return undefined;
    };

    let styleCopy = Object.assign({}, style);
    if (card.upgrades) {
        styleCopy.top = card.upgrades.length * (15 * getCardSizeMultiplier());
    }
    if (wrapped) {
        return (
            <div className='card-wrapper' style={style}>
                {getCard()}
                {getupgrades()}
                {renderUnderneathCards()}
            </div>
        );
    }

    return getCard();
};

Card.displayName = 'Card';

Card.defaultProps = {
    halfSize: false,
    isSpectating: true,
    orientation: 'vertical',
    wrapped: true
};

export default Card;
