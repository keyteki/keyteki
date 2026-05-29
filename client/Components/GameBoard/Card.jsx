import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';

import { ItemTypes } from '../../constants';
import CardImage from './CardImage';
import CardMenu from './CardMenu';
import SquishableCardPanel from './SquishableCardPanel';

import { useTranslation } from 'react-i18next';

// Module-level coordinator so that opening one card menu closes any other
// card menu that is currently open. Each Card subscribes on mount and
// dispatches when it opens its menu; subscribers ignore their own events.
const cardMenuCoordinator = (() => {
    const target = typeof EventTarget !== 'undefined' ? new EventTarget() : null;
    let nextId = 0;
    return {
        nextId: () => ++nextId,
        announceOpen(id) {
            target?.dispatchEvent(new CustomEvent('cardmenu:open', { detail: id }));
        },
        subscribe(id, onOtherOpen) {
            if (!target) return () => {};
            const handler = (event) => {
                if (event.detail !== id) {
                    onOtherOpen();
                }
            };
            target.addEventListener('cardmenu:open', handler);
            return () => target.removeEventListener('cardmenu:open', handler);
        }
    };
})();

const Card = ({
    canDrag,
    card,
    cardBack,
    className,
    disableMouseOver,
    halfSize = false,
    hasActiveHouse = false,
    isMe = false,
    isSpectating = true,
    onClick,
    onMenuItemClick,
    onMouseOut,
    onMouseOver,
    orientation = 'vertical',
    size,
    source,
    style,
    wrapped = true
}) => {
    const { i18n } = useTranslation();

    const sizeClass = {
        [size]: size !== 'normal'
    };

    const [showMenu, setShowMenu] = useState(false);
    const cardFrameRef = useRef(null);
    const menuIdRef = useRef(null);
    if (menuIdRef.current === null) {
        menuIdRef.current = cardMenuCoordinator.nextId();
    }

    // Close this card's menu when another card opens its menu, and when
    // the user mousedowns anywhere outside our card-frame.
    useEffect(() => {
        if (!showMenu) {
            return;
        }
        const unsubscribe = cardMenuCoordinator.subscribe(menuIdRef.current, () =>
            setShowMenu(false)
        );
        const onDocMouseDown = (event) => {
            if (cardFrameRef.current && !cardFrameRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', onDocMouseDown);
        return () => {
            unsubscribe();
            document.removeEventListener('mousedown', onDocMouseDown);
        };
    }, [showMenu]);

    const [{ dragOffset, isDragging }, drag, preview] = useDrag({
        type: ItemTypes.CARD,
        item: { card: card, source: source },
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
            const opening = !showMenu;
            setShowMenu(opening);
            if (opening) {
                cardMenuCoordinator.announceOpen(menuIdRef.current);
            }
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
                    hasActiveHouse={hasActiveHouse}
                    isMe={isMe}
                    isSpectating={isSpectating}
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
        // Each upgrade adds an effective -15px to the wrapper's vertical flow,
        // which would pull the underneath panel up by 15px per upgrade and eat
        // into the bottom peek. Visually translate it back down so the peek is
        // preserved regardless of upgrade count.
        const upgradeOffset = (card.upgrades?.length || 0) * 15 * getCardSizeMultiplier();
        const underneathStyle = upgradeOffset
            ? { transform: `translateY(${upgradeOffset}px)` }
            : undefined;
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
                hasActiveHouse={hasActiveHouse}
                isMe={isMe}
                source='underneath'
                style={underneathStyle}
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

        const shouldMuteCannotPlay = !isSpectating && hasActiveHouse;
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
                    !card.unselectable && card.canPlay && !card.selected && !card.selectable,
                'cannot-play':
                    shouldMuteCannotPlay &&
                    typeof card.canPlay === 'boolean' &&
                    !card.canPlay &&
                    !card.selected &&
                    !card.selectable,
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
                <CardImage card={card} cardBack={cardBack} size={size} halfSize={halfSize} />
            </div>
        ) : null;
        return (
            <div
                className='card-frame'
                ref={(node) => {
                    drag(node);
                    cardFrameRef.current = node;
                }}
            >
                {getDragFrame(image)}
                {getCardOrdering()}
                <div
                    className={cardClass}
                    onMouseOver={
                        !disableMouseOver && onMouseOver
                            ? () =>
                                  onMouseOver({
                                      image: (
                                          <CardImage
                                              card={{
                                                  ...(card.versusCard || card),
                                                  // Opponent's facedown cards have no name in the
                                                  // summary; render the cardback in that case.
                                                  facedown: !card.name,
                                                  location: 'zoom'
                                              }}
                                              cardBack={cardBack}
                                          />
                                      ),
                                      size: 'normal'
                                  })
                            : undefined
                    }
                    onMouseOut={!disableMouseOver ? onMouseOut : undefined}
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

export default Card;
