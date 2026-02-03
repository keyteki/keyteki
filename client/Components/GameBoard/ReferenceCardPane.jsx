import React, { useState } from 'react';

import CardBack from '../Decks/CardBack';
import CardImage from './CardImage';
import CardMenu from './CardMenu';
import { Constants } from '../../constants';

const getCardImage = (locale, image) => `/img/cards/${locale === 'en' ? '' : locale}/${image}.png`;

const ReferenceCardPane = ({
    thisPlayer,
    otherPlayer,
    currentGame,
    user,
    i18n,
    t,
    onMouseOver,
    onMouseOut,
    onCardClick,
    onClickTide,
    onClickProphecy,
    onMenuItemClick,
    cardSize,
    showDeckName,
    spectating
}) => {
    const [openProphecyMenu, setOpenProphecyMenu] = useState(null);

    const renderToken = (player) => {
        if (!player?.tokenCard) {
            return null;
        }

        const img = getCardImage(i18n.language, player.tokenCard.image);
        return (
            <img
                className='img-fluid normal reference-card'
                src={img}
                onMouseOver={() => {
                    onMouseOver({
                        image: <img src={img} className='card-zoom normal' />,
                        size: 'normal'
                    });
                }}
                onMouseOut={onMouseOut}
                title={t(`${player.tokenCard.name}`)}
            />
        );
    };

    const renderProphecies = (player) => {
        if (!player?.prophecyCards || player.prophecyCards.length === 0) {
            return null;
        }

        const locale = i18n.language;
        const prophecyPairs = [];

        for (let i = 0; i < player.prophecyCards.length; i += 2) {
            prophecyPairs.push(player.prophecyCards.slice(i, i + 2));
        }

        return (
            <div className='prophecy-player-section'>
                {prophecyPairs.map((pair, pairIndex) => (
                    <div key={`prophecy-pair-${pairIndex}`} className='prophecy-grid'>
                        {pair.map((card) => {
                            const img = card.facedown
                                ? Constants.DefaultCard
                                : getCardImage(locale, card.image);
                            const isController = player.name === user.username;
                            const isClickable =
                                isController &&
                                (card.canActivateProphecy || currentGame.manualMode);
                            const isActive = card.activeProphecy;
                            const className = `img-fluid normal reference-card prophecy-card ${
                                isActive ? 'active' : 'inactive'
                            } ${isClickable ? 'clickable' : ''} ${
                                !isActive && card.canActivateProphecy ? 'can-activate' : ''
                            }`;

                            return (
                                <div key={card.uuid} className='prophecy-card-container'>
                                    <img
                                        className={className}
                                        src={img}
                                        onClick={
                                            card.selectable
                                                ? () => onCardClick(card)
                                                : isClickable
                                                ? () => {
                                                      if (
                                                          currentGame.manualMode &&
                                                          card.menu &&
                                                          card.menu.length > 0
                                                      ) {
                                                          setOpenProphecyMenu(
                                                              openProphecyMenu === card.uuid
                                                                  ? null
                                                                  : card.uuid
                                                          );
                                                      } else {
                                                          onClickProphecy(card);
                                                      }
                                                  }
                                                : undefined
                                        }
                                        onMouseOver={() => {
                                            onMouseOver({
                                                image: card.facedown ? (
                                                    <img src={img} className='card-zoom normal' />
                                                ) : (
                                                    <CardImage
                                                        card={{ ...card, location: 'zoom' }}
                                                    />
                                                ),
                                                size: 'normal'
                                            });
                                        }}
                                        onMouseOut={onMouseOut}
                                        title={
                                            card.facedown ? 'Face-down prophecy' : t(`${card.name}`)
                                        }
                                    />
                                    {openProphecyMenu === card.uuid &&
                                        card.menu &&
                                        card.menu.length > 0 && (
                                            <CardMenu
                                                menu={card.menu}
                                                onMenuItemClick={(menuItem) => {
                                                    onMenuItemClick(card, menuItem);
                                                    setOpenProphecyMenu(null);
                                                }}
                                            />
                                        )}
                                    {isActive &&
                                        card.childCards &&
                                        card.childCards.length > 0 &&
                                        card.childCards.map((childCard, childIndex) => (
                                            <div
                                                key={`${card.uuid}-child-${childIndex}`}
                                                className='child-card-under-prophecy'
                                                style={{
                                                    top: `${35 + childIndex * 4}px`,
                                                    left: `${childIndex * 2}px`
                                                }}
                                                onMouseOver={() => {
                                                    if (isController) {
                                                        onMouseOver({
                                                            image: (
                                                                <CardImage
                                                                    card={{
                                                                        ...childCard,
                                                                        location: 'zoom'
                                                                    }}
                                                                />
                                                            ),
                                                            size: 'normal'
                                                        });
                                                    }
                                                }}
                                                onMouseOut={onMouseOut}
                                                title={
                                                    isController
                                                        ? t(`${childCard.name}`)
                                                        : 'Face-down card'
                                                }
                                            >
                                                <CardBack
                                                    deck={player.deckData}
                                                    showDeckName={showDeckName(!spectating)}
                                                    zoom={false}
                                                    size={cardSize}
                                                />
                                            </div>
                                        ))}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    const renderTide = () => {
        if (!thisPlayer.stats.tideRequired && !otherPlayer?.stats?.tideRequired) {
            return null;
        }

        const locale = i18n.language;
        const img = Constants.TideImages.card[locale] ?? Constants.TideImages.card['en'];

        return (
            <img
                onClick={onClickTide}
                className={`img-fluid normal reference-card tide-card tide-${thisPlayer.stats.tide}
                    ${thisPlayer.activeHouse && thisPlayer.canRaiseTide ? 'can-raise-tide' : ''}`}
                src={img}
                onMouseOver={() => {
                    onMouseOver({
                        image: <img src={img} className='card-zoom normal' />,
                        size: `tide-${thisPlayer.stats.tide}`
                    });
                }}
                onMouseOut={onMouseOut}
                title={t(`${thisPlayer.stats.tide}-tide`)}
            />
        );
    };

    if (
        !thisPlayer.stats.tideRequired &&
        !(otherPlayer && otherPlayer.stats.tideRequired) &&
        !thisPlayer.tokenCard &&
        !(otherPlayer && otherPlayer.tokenCard) &&
        !(thisPlayer.prophecyCards && thisPlayer.prophecyCards.length > 0) &&
        !(otherPlayer && otherPlayer.prophecyCards && otherPlayer.prophecyCards.length > 0)
    ) {
        return null;
    }

    return (
        <div className='reference-card-pane'>
            {otherPlayer && (
                <>
                    {renderToken(otherPlayer)}
                    {renderProphecies(otherPlayer)}
                </>
            )}
            {renderTide()}
            {renderToken(thisPlayer)}
            {renderProphecies(thisPlayer)}
        </div>
    );
};

export default ReferenceCardPane;
