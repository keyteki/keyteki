import React, { useState } from 'react';
import { sortBy } from 'underscore';
import { useTranslation, Trans } from 'react-i18next';

import { Constants } from '../../constants';
import CardBack from './CardBack';
import CardImage from '../GameBoard/CardImage';

import AmberImage from '../../assets/img/enhancements/amberui.png';
import CaptureImage from '../../assets/img/enhancements/captureui.png';
import DrawImage from '../../assets/img/enhancements/drawui.png';
import DamageImage from '../../assets/img/enhancements/damageui.png';
import DiscardImage from '../../assets/img/enhancements/discardui.png';

// cardsOnly: when true, suppress stats/enhancement summary; show only houses & card list
const DeckSummary = ({ deck, cardsOnly = false }) => {
    const { t, i18n } = useTranslation();
    let [zoomCard, setZoomCard] = useState(null);
    let [mousePos, setMousePosition] = useState({ x: 0, y: 0 });
    const cardsByHouse = {};
    const enhancements = {};

    // Never mutate props (Redux state may be frozen). Sort a shallow copy.
    for (const house of [...(deck.houses || [])].sort()) {
        console.info(deck);
        cardsByHouse[house] = [];
        const filteredCards = sortBy(
            deck.cards.filter((c) => c.card.house === house && !c.isNonDeck),
            (c) => c.card.name
        );

        for (const card of filteredCards) {
            for (let i = 0; i < card.count; i++) {
                let cardClass = 'cursor-pointer text-secondary hover:text-sky-400';

                if (card.card.enhancements) {
                    cardClass += ' text-sky-700';
                    for (const e of card.card.enhancements) {
                        enhancements[e] = 1 + (enhancements[e] || 0);
                    }
                }

                cardsByHouse[house].push(
                    <div
                        key={`${card.dbId}${i}`}
                        className={cardClass}
                        onMouseOver={() => setZoomCard(card.card)}
                        onMouseMove={(event) => {
                            let y = event.clientY;
                            let yPlusHeight = y + 420;

                            if (yPlusHeight >= window.innerHeight) {
                                y -= yPlusHeight - window.innerHeight;
                            }

                            setMousePosition({ x: event.clientX, y: y });
                        }}
                        onMouseOut={() => setZoomCard(null)}
                    >
                        {card.card.locale && card.card.locale[i18n.language]
                            ? card.card.locale[i18n.language].name
                            : card.card.name}
                        {card.card.maverick && (
                            <img className='w-4 h-4' src={Constants.MaverickIcon} />
                        )}
                        {card.card.anomaly && (
                            <img className='w-4 h-4' src={Constants.AnomalyIcon} />
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
                    className='cursor-pointer text-secondary hover:text-sky-400'
                    onMouseOver={() => setZoomCard(card.card)}
                    onMouseMove={(event) => {
                        let y = event.clientY;
                        let yPlusHeight = y + 420;

                        if (yPlusHeight >= window.innerHeight) {
                            y -= yPlusHeight - window.innerHeight;
                        }

                        setMousePosition({ x: event.clientX, y: y });
                    }}
                    onMouseOut={() => setZoomCard(null)}
                >
                    {card.card.locale && card.card.locale[i18n.language]
                        ? card.card.locale[i18n.language].name
                        : card.card.name}
                    {card.card.maverick && <img className='w-4 h-4' src={Constants.MaverickIcon} />}
                    {card.card.anomaly && <img className='w-4 h-4' src={Constants.AnomalyIcon} />}
                </div>
            );
        });

    return (
        <div className='w-full mt-4'>
            {!cardsOnly && (
                <div className='flex flex-wrap gap-4'>
                    <div className='flex-1'>
                        <div className='flex justify-between mb-2'>
                            <span>{t('Wins')}</span>
                            <span>{deck.wins}</span>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <span>{t('Losses')}</span>
                            <span>{deck.losses}</span>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <span>{t('Total')}</span>
                            <span>{parseInt(deck.wins) + parseInt(deck.losses)}</span>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <span>{t('Win Rate')}</span>
                            <span>{deck.winRate?.toFixed(2)}%</span>
                        </div>
                        {Object.keys(enhancements).length > 0 ? (
                            <div className='flex gap-2 pl-3 pt-4'>
                                <div className='px-0.5 flex flex-col items-center'>
                                    <img src={AmberImage} className='h-5 w-5' />
                                    <span className='pl-1'>{enhancements.amber || 0}</span>
                                </div>
                                <div className='px-0.5 flex flex-col items-center'>
                                    <img src={CaptureImage} className='h-5 w-5' />
                                    <span className='pl-1'>{enhancements.capture || 0}</span>
                                </div>
                                <div className='px-0.5 flex flex-col items-center'>
                                    <img src={DrawImage} className='h-5 w-5' />
                                    <span className='pl-1'>{enhancements.draw || 0}</span>
                                </div>
                                <div className='px-0.5 flex flex-col items-center'>
                                    <img src={DamageImage} className='h-5 w-5' />
                                    <span className='pl-1'>{enhancements.damage || 0}</span>
                                </div>
                                <div className='px-0.5 flex flex-col items-center'>
                                    <img src={DiscardImage} className='h-5 w-5' />
                                    <span className='pl-1'>{enhancements.discard || 0}</span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
            <div className='flex flex-wrap mt-4 py-1.5 bg-primary/40'>
                {deck.houses.map((house) => {
                    return (
                        <div key={house} className='w-full sm:w-1/3 text-center'>
                            <img className='w-8 mx-auto' src={Constants.HouseIconPaths[house]} />
                            <span className='pl-4'>
                                {t(house)[0].toUpperCase() + t(house).slice(1)}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className='pt-4'>
                {deck.houses.map((house) => {
                    return (
                        <div key={house} className='sm:w-1/3 inline-block'>
                            {cardsByHouse[house]}
                        </div>
                    );
                })}
            </div>

            {deck.cards.some((c) => c.isNonDeck && (!c.card || c.card.type !== 'archon power')) && (
                <div className='mt-4 py-1.5 bg-primary/40 w-full'>
                    <Trans>Non-Deck Cards</Trans>
                </div>
            )}
            <div className='pt-4'>
                <div className='sm:w-1/3'>{nonDeckCards}</div>
            </div>
        </div>
    );
};

DeckSummary.displayName = 'DeckSummary';

export default DeckSummary;
