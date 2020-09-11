import React from 'react';
import classNames from 'classnames';

import Card from './Card';
import CardTiledList from './CardTiledList';
import Droppable from './Droppable';
import MovablePanel from './MovablePanel';

import './CardPile.scss';
import { useState } from 'react';

const CardPile = ({
    cards,
    cardCount,
    className,
    hiddenTopCard,
    menu,
    orientation,
    size,
    title,
    topCard
}) => {
    const [showMenu, setShowMenu] = useState(false);
    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         showPopup: !!props.cards && props.cards.some((card) => card.selectable),
    //         showMenu: false
    //     };

    //     this.onCollectionClick = this.onCollectionClick.bind(this);
    //     this.onTopCardClick = this.onTopCardClick.bind(this);
    //     this.onCloseClick = this.onCloseClick.bind(this);
    // }

    // // eslint-disable-next-line camelcase
    // UNSAFE_componentWillReceiveProps(props) {
    //     let hasNewSelectableCard = props.cards && props.cards.some((card) => card.selectable);
    //     let didHaveSelectableCard =
    //         this.props.cards && this.props.cards.some((card) => card.selectable);

    //     if (!didHaveSelectableCard && hasNewSelectableCard) {
    //         this.updatePopupVisibility(true);
    //     } else if (didHaveSelectableCard && !hasNewSelectableCard) {
    //         this.updatePopupVisibility(false);
    //     }
    // }

    // togglePopup() {
    //     this.updatePopupVisibility(!this.state.showPopup);
    // }

    // updatePopupVisibility(value) {
    //     this.setState({ showPopup: value });

    //     if (this.props.onPopupChange) {
    //         this.props.onPopupChange({ source: this.props.source, visible: value });
    //     }
    // }

    // onCollectionClick(event) {
    //     event.preventDefault();

    //     if (this.props.menu) {
    //         this.setState({ showMenu: !this.state.showMenu });
    //         return;
    //     }

    //     if (!this.props.disablePopup) {
    //         this.togglePopup();
    //     }
    // }

    const onMenuItemClick = (menuItem) => {
        if (menuItem.showPopup) {
            this.togglePopup();
        }

        if (menuItem.handler) {
            menuItem.handler();
        }
    };

    // onCloseClick(event) {
    //     event.preventDefault();
    //     event.stopPropagation();

    //     this.togglePopup();
    // }

    // onPopupMenuItemClick(menuItem) {
    //     if (menuItem.handler) {
    //         menuItem.handler();
    //     }

    //     this.togglePopup();
    // }

    // onTopCardClick() {
    //     if (this.props.menu) {
    //         this.setState({ showMenu: !this.state.showMenu });
    //         return;
    //     }

    //     if (this.props.disablePopup || this.isTopCardSelectable) {
    //         if (this.props.onCardClick && this.props.topCard) {
    //             this.props.onCardClick(this.props.topCard);
    //         }

    //         return;
    //     }

    //     this.togglePopup();
    // }

    // get isTopCardSelectable() {
    //     if (!this.props.topCard) {
    //         return false;
    //     }

    //     return (
    //         this.props.topCard.selectable &&
    //         (!this.props.cards || this.props.cards.every((card) => card.unselectable))
    //     );
    // }

    // onCardClick(card) {
    //     if (this.props.closeOnClick) {
    //         this.updatePopupVisibility(false);
    //     }

    //     if (this.props.onCardClick) {
    //         this.props.onCardClick(card);
    //     }
    // }

    // getPopup() {
    //     let popup = null;
    //     let cardList = [];

    //     let listProps = {
    //         cardBackUrl: this.props.cardBackUrl,
    //         disableMouseOver: this.props.disableMouseOver,
    //         manualMode: this.props.manualMode,
    //         onCardClick: this.onCardClick.bind(this),
    //         onCardMouseOut: this.props.onMouseOut,
    //         onCardMouseOver: this.props.onMouseOver,
    //         onTouchMove: this.props.onTouchMove,
    //         size: size,
    //         source: this.props.source
    //     };

    //     if (this.props.cards && this.props.cards.some((card) => card.group)) {
    //         const cardGroup = this.props.cards.reduce((grouping, card) => {
    //             (grouping[card.group] = grouping[card.group] || []).push(card);

    //             return grouping;
    //         }, {});
    //         const sortedKeys = Object.keys(cardGroup).sort();
    //         for (const key of sortedKeys) {
    //             cardList.push(
    //                 <CardTiledList cards={cardGroup[key]} key={key} title={key} {...listProps} />
    //             );
    //         }
    //     } else {
    //         cardList = <CardTiledList cards={this.props.cards} {...listProps} />;
    //     }

    //     if (this.props.disablePopup || !this.state.showPopup) {
    //         return null;
    //     }

    //     let popupClass = classNames('panel-body', {
    //         'our-side': this.props.popupLocation === 'bottom'
    //     });

    //     let innerClass = classNames('inner', size);
    //     let linkIndex = 0;

    //     let popupMenu = this.props.popupMenu ? (
    //         <div>
    //             {this.props.popupMenu.map((menuItem) => {
    //                 return (
    //                     <a
    //                         className='btn btn-default'
    //                         key={linkIndex++}
    //                         onClick={() => this.onPopupMenuItemClick(menuItem)}
    //                     >
    //                         {menuItem.text}
    //                     </a>
    //                 );
    //             })}
    //         </div>
    //     ) : null;

    //     popup = (
    //         <MovablePanel
    //             title={this.props.title}
    //             name={this.props.source}
    //             onCloseClick={this.onCloseClick}
    //             side={this.props.popupLocation}
    //         >
    //             <Droppable
    //                 onDragDrop={this.props.onDragDrop}
    //                 source={this.props.source}
    //                 manualMode={this.props.manualMode}
    //             >
    //                 <div className={popupClass} onClick={(event) => event.stopPropagation()}>
    //                     {popupMenu}
    //                     <div className={innerClass}>{cardList}</div>
    //                 </div>
    //             </Droppable>
    //         </MovablePanel>
    //     );

    //     return popup;
    // }

    let menuIndex = 0;

    let menuItems = menu.map((item) => {
        return (
            <div
                key={(menuIndex++).toString()}
                className='menu-item'
                onClick={onMenuItemClick.bind(this, item)}
            >
                {item.text}
            </div>
        );
    });

    let classNameStr = classNames('panel', 'card-pile', className, {
        [size]: size !== 'normal',
        horizontal: orientation === 'horizontal' || orientation === 'exhausted',
        vertical: orientation === 'vertical'
    });

    let cardCountStr = cardCount || (cards ? cards.length : '0');
    let headerText = title ? `${title} (${cardCountStr})` : '';
    let topCard = topCard || (cards ? cards[0] : null);
    let cardOrientation =
        orientation === 'horizontal' && topCard && topCard.facedown ? 'exhausted' : orientation;

    if (hiddenTopCard && !topCard) {
        topCard = { facedown: true };
    }

    return (
        <div className={classNameStr} onClick={this.onCollectionClick}>
            <div className='panel-header'>{headerText}</div>
            {topCard ? (
                <Card
                    cardBackUrl={this.props.cardBackUrl}
                    canDrag={this.props.manualMode}
                    card={topCard}
                    source={this.props.source}
                    onMouseOver={this.props.onMouseOver}
                    onMouseOut={this.props.onMouseOut}
                    disableMouseOver={this.props.hiddenTopCard}
                    onClick={this.onTopCardClick}
                    onMenuItemClick={this.props.onMenuItemClick}
                    orientation={cardOrientation}
                    size={size}
                />
            ) : (
                <div className='card-placeholder' />
            )}
            {showMenu ? menuItems : null}
            {this.getPopup()}
        </div>
    );
};

CardPile.displayName = 'CardPile';
CardPile.defaultProps = {
    popupLocation: 'bottom',
    orientation: 'vertical'
};

export default CardPile;
