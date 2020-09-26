import React, { useState } from 'react';
import classNames from 'classnames';
import 'jquery-migrate';
import { useDrag } from 'react-dnd';

import CardMenu from './CardMenu';
import CardCounters from './CardCounters';
import CardImage from './CardImage';
import { ItemTypes } from '../../constants';
import SquishableCardPanel from './SquishableCardPanel';

import './Card.scss';

const Card = ({
    canDrag,
    card,
    cardBackUrl,
    className,
    disableMouseOver,
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
        return source === 'play area';
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

    const getCountersForCard = (card) => {
        const singleValueCounters = ['ward', 'enrage'];
        let counters = [];
        let needsFade = card.type === 'upgrade' && !['full deck'].includes(source);
        if (card.type === 'creature' && card.baseStrength !== card.strength) {
            counters.push({
                name: 'strength',
                count: card.strength,
                fade: needsFade,
                showValue: true
            });
        }

        for (const [key, token] of Object.entries(card.tokens || {})) {
            counters.push({
                name: key,
                count: token,
                fade: needsFade,
                showValue: token > 1 || !singleValueCounters.includes(key),
                broken: key === 'ward' && card.wardBroken
            });
        }

        if (card.pseudoDamage) {
            counters.push({
                name: 'damage',
                count: card.pseudoDamage,
                fade: true,
                showValue: true
            });
        }

        for (const upgrade of card.upgrades || []) {
            counters = counters.concat(getCountersForCard(upgrade));
        }

        if (card.stunned) {
            counters.push({ name: 'stun', count: 1, showValue: false });
        }

        return counters.filter((counter) => counter.count >= 0);
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

        let index = 1;
        let upgrades = card.upgrades.map((upgrade) => {
            let returnedupgrade = (
                <Card
                    key={upgrade.uuid}
                    source={source}
                    card={upgrade}
                    className={classNames('upgrade', `upgrade-${index}`)}
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
                />
            );

            index += 1;
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
                cardBackUrl={cardBackUrl}
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

    const showCounters = () => {
        if (['full deck'].includes(source)) {
            return true;
        }

        if (source !== 'play area' && source !== 'faction') {
            return false;
        }

        if (card.facedown || card.type === 'upgrade') {
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
        let imageClass = classNames('card-image vertical', sizeClass, {
            exhausted: orientation === 'exhausted' || card.exhausted || orientation === 'horizontal'
        });
        let image = card ? (
            <div className={imageClass}>
                <CardImage card={card} cardBack={cardBackUrl} />
            </div>
        ) : null;
        return (
            <div className='card-frame' ref={drag}>
                {getDragFrame(image)}
                {getCardOrdering()}
                <div
                    className={cardClass}
                    onMouseOver={
                        !disableMouseOver && !isFacedown() && onMouseOver
                            ? () => onMouseOver(card)
                            : undefined
                    }
                    onMouseOut={!disableMouseOver && !isFacedown() ? onMouseOut : undefined}
                    onClick={(event) => onCardClicked(event, card)}
                >
                    <div>
                        <span className='card-name'>{card.name}</span>
                        {image}
                    </div>
                    {showCounters() && <CardCounters counters={getCountersForCard(card)} />}
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
