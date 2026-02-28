import React, { useState } from 'react';
import { sortBy } from 'underscore';
import { useTranslation, Trans } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Constants } from '../../constants';
import CardBack from './CardBack';
import CardHoverPreview from '../Site/CardHoverPreview';
import { useUpdateAccoladeShownMutation } from '../../redux/api';

import AmberImage from '../../assets/img/enhancements/amberui.png';
import CaptureImage from '../../assets/img/enhancements/captureui.png';
import DrawImage from '../../assets/img/enhancements/drawui.png';
import DamageImage from '../../assets/img/enhancements/damageui.png';
import DiscardImage from '../../assets/img/enhancements/discardui.png';

const DeckSummary = ({ deck }) => {
    const { t, i18n } = useTranslation();
    const [triggerUpdateAccoladeShown] = useUpdateAccoladeShownMutation();
    const user = useSelector((state) => state.account.user);
    const showAccolades = user?.settings?.optionSettings?.showAccolades ?? true;
    const getHouseLabel = (house) => {
        const translated = t(house) || '';
        return translated ? translated[0].toUpperCase() + translated.slice(1) : translated;
    };
    const [hoveredCard, setHoveredCard] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
    const cardsByHouse = {};
    const enhancements = {};
    const orderedHouses = Constants.Houses.filter((house) => deck.houses.includes(house));

    const handleAccoladeClick = (accolade) => {
        if (!accolade.shown) {
            const shownCount = deck.accolades.filter((a) => a.shown).length;
            if (shownCount >= 3) {
                return;
            }
        }
        triggerUpdateAccoladeShown({
            deckId: deck.id,
            accoladeId: accolade.id,
            shown: !accolade.shown
        });
    };

    const updateHoverPosition = (event) => {
        let y = event.clientY;
        const yPlusHeight = y + 420;

        if (yPlusHeight >= window.innerHeight) {
            y -= yPlusHeight - window.innerHeight;
        }

        setHoverPosition({ x: event.clientX + 5, y });
    };

    for (const house of orderedHouses) {
        cardsByHouse[house] = [];
        const filteredCards = sortBy(
            deck.cards.filter((c) => c.card.house === house && !c.isNonDeck),
            (c) => c.card.name
        );

        for (const card of filteredCards) {
            for (let i = 0; i < card.count; i++) {
                let cardClass = 'deck-card-link';

                if (card.card.enhancements) {
                    cardClass += ' enhanced-card';
                    for (const e of card.card.enhancements) {
                        enhancements[e] = 1 + (enhancements[e] || 0);
                    }
                }

                cardsByHouse[house].push(
                    <div
                        key={`${card.dbId}${i}`}
                        className={cardClass}
                        onMouseEnter={(event) => {
                            setHoveredCard(card.card);
                            updateHoverPosition(event);
                        }}
                        onMouseMove={updateHoverPosition}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        {card.card.locale && card.card.locale[i18n.language]
                            ? card.card.locale[i18n.language].name
                            : card.card.name}
                        {card.card.maverick && (
                            <img className='h-4 w-4' src={Constants.MaverickIcon} />
                        )}
                        {card.card.anomaly && (
                            <img className='h-4 w-4' src={Constants.AnomalyIcon} />
                        )}
                    </div>
                );
            }
        }
    }

    let nonDeckCards = deck.cards
        .filter((c) => c.isNonDeck)
        // Filter out archon power cards
        .filter((c) => !c.card || c.card.type !== 'archon power')
        // Deduplicate token creatures (not prophecy cards)
        .filter((card, idx, arr) => {
            if (card.card && card.card.type === 'token creature') {
                // Only keep the first occurrence of each token card id (and prophecyId if present)
                return (
                    arr.findIndex(
                        (c) =>
                            c.card &&
                            c.card.type === 'token creature' &&
                            c.id === card.id &&
                            (c.prophecyId || null) === (card.prophecyId || null)
                    ) === idx
                );
            }
            return true;
        })
        .sort((a, b) => {
            // Sort prophecy cards by ProphecyId first, then by dbId
            if (a.card.type === 'prophecy' && b.card.type === 'prophecy') {
                // Both are prophecies - sort by ProphecyId first, then by dbId
                const aId = a.prophecyId || 999;
                const bId = b.prophecyId || 999;
                if (aId !== bId) {
                    return aId - bId;
                }
                return a.dbId - b.dbId;
            }
            // If only one is a prophecy or neither is a prophecy, maintain original order
            return a.dbId - b.dbId;
        })
        .map((card, i) => {
            return (
                <div
                    key={`${card.dbId}${i}`}
                    className='deck-card-link'
                    onMouseEnter={(event) => {
                        setHoveredCard(card.card);
                        updateHoverPosition(event);
                    }}
                    onMouseMove={updateHoverPosition}
                    onMouseLeave={() => setHoveredCard(null)}
                >
                    {card.card.locale && card.card.locale[i18n.language]
                        ? card.card.locale[i18n.language].name
                        : card.card.name}
                    {card.card.maverick && <img className='h-4 w-4' src={Constants.MaverickIcon} />}
                    {card.card.anomaly && <img className='h-4 w-4' src={Constants.AnomalyIcon} />}
                </div>
            );
        });

    const totalGames = parseInt(deck.wins || 0) + parseInt(deck.losses || 0);

    return (
        <div className='deck-summary mx-auto mt-3 w-full max-w-5xl'>
            <div className='flex flex-wrap items-start gap-4'>
                <div className='w-full max-w-52 shrink-0 aspect-[5/7] sm:w-[32%]'>
                    <CardBack
                        className='block h-full w-full overflow-hidden'
                        imageClassName='!h-full !w-full !max-h-full !max-w-full'
                        deck={deck}
                    />
                </div>
                <div className='min-w-56 flex-1'>
                    <div className='grid max-w-72 grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-lg'>
                        <span className='text-muted'>{t('Wins')}</span>
                        <span className='font-bold text-foreground'>{deck.wins}</span>
                        <span className='text-muted'>{t('Losses')}</span>
                        <span className='font-bold text-foreground'>{deck.losses}</span>
                        <span className='text-muted'>{t('Total')}</span>
                        <span className='font-bold text-foreground'>{totalGames}</span>
                        <span className='text-muted'>{t('Win Rate')}</span>
                        <span className='font-bold text-foreground'>
                            {deck.winRate?.toFixed(2)}%
                        </span>
                    </div>
                    {Object.keys(enhancements).length > 0 ? (
                        <div className='deck-enhancements flex flex-wrap items-center gap-3 ps-0 pt-3'>
                            <div className='deck-enhancement inline-flex items-center'>
                                <img src={AmberImage} className='deck-img-enhancement' />
                                <span className='pl-1'>{enhancements.amber || 0}</span>
                            </div>
                            <div className='deck-enhancement inline-flex items-center'>
                                <img src={CaptureImage} className='deck-img-enhancement' />
                                <span className='pl-1'>{enhancements.capture || 0}</span>
                            </div>
                            <div className='deck-enhancement inline-flex items-center'>
                                <img src={DrawImage} className='deck-img-enhancement' />
                                <span className='pl-1'>{enhancements.draw || 0}</span>
                            </div>
                            <div className='deck-enhancement inline-flex items-center'>
                                <img src={DamageImage} className='deck-img-enhancement' />
                                <span className='pl-1'>{enhancements.damage || 0}</span>
                            </div>
                            <div className='deck-enhancement inline-flex items-center'>
                                <img src={DiscardImage} className='deck-img-enhancement' />
                                <span className='pl-1'>{enhancements.discard || 0}</span>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            {showAccolades && deck.accolades && deck.accolades.length > 0 && (
                <div className='mt-2.5 mb-2 flex flex-wrap justify-start'>
                    {deck.accolades.map((accolade, index) => {
                        const shownCount = deck.accolades.filter((a) => a.shown).length;
                        const canSelect = accolade.shown || shownCount < 3;
                        const className = [
                            'mx-1 w-10 h-auto',
                            canSelect
                                ? 'cursor-pointer hover:opacity-80'
                                : 'cursor-not-allowed opacity-30',
                            accolade.shown ? 'rounded ring-1 ring-[#0dcaf0]' : ''
                        ]
                            .filter(Boolean)
                            .join(' ');
                        return (
                            <img
                                key={index}
                                src={accolade.image}
                                alt={accolade.name}
                                title={accolade.name}
                                className={className}
                                onClick={() => canSelect && handleAccoladeClick(accolade)}
                            />
                        );
                    })}
                </div>
            )}
            <div className='relative mt-4 grid grid-cols-1 gap-2 sm:justify-center sm:gap-x-10 sm:[grid-template-columns:repeat(3,max-content)]'>
                <CardHoverPreview card={hoveredCard} position={hoverPosition} />
                {orderedHouses.map((house) => {
                    return (
                        <div key={house} className='w-fit text-left'>
                            <div className='deck-houses rounded-sm px-0 py-2'>
                                <div className='inline-flex w-fit items-center gap-2 text-left'>
                                    <img className='w-8' src={Constants.HouseIconPaths[house]} />
                                    <span>{getHouseLabel(house)}</span>
                                </div>
                            </div>
                            <div className='deck-cards pt-3'>{cardsByHouse[house]}</div>
                        </div>
                    );
                })}
            </div>

            {deck.cards.some((c) => c.isNonDeck && (!c.card || c.card.type !== 'archon power')) && (
                <div className='deck-houses mt-5 inline-block rounded-sm px-0 py-2 text-left'>
                    <div>
                        <Trans>Non-Deck Cards</Trans>
                    </div>
                </div>
            )}
            <div className='deck-cards pt-3'>
                <div className='w-fit text-left'>{nonDeckCards}</div>
            </div>
        </div>
    );
};

DeckSummary.displayName = 'DeckSummary';

export default DeckSummary;
