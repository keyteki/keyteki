import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Button, Input, ListBox, Modal as HeroModal, Select, toast } from '@heroui/react';

import Panel from '../Components/Site/Panel';
import ApiStatus from '../Components/Site/ApiStatus';
import { useGetDecksQuery, useSaveAllianceDeckMutation } from '../redux/api';
import { Constants } from '../constants';
import AlertPanel from '../Components/Site/AlertPanel';
import CardHoverPreview from '../Components/Site/CardHoverPreview';

const AllianceBuilderPage = () => {
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [saveAllianceDeck, saveState] = useSaveAllianceDeckMutation();
    const getHouseLabel = (house) => {
        const translated = t(house) || '';
        return translated ? translated[0].toUpperCase() + translated.slice(1) : translated;
    };

    useEffect(() => {
        if (saveState.isSuccess) {
            toast.success(t('Alliance deck saved.'));
            saveState.reset();
            navigate('/decks');
        }
    }, [navigate, saveState, t]);

    useEffect(
        () => () => {
            if (hoverPanelCloseTimerRef.current) {
                clearTimeout(hoverPanelCloseTimerRef.current);
            }
        },
        []
    );

    useEffect(() => {
        if (saveState.isError) {
            toast.danger(
                saveState.error?.data?.message ||
                    t('Failed to save alliance deck. Please try again.')
            );
        }
    }, [saveState.error, saveState.isError, t]);

    const apiState = saveState.isUninitialized
        ? null
        : {
              loading: saveState.isLoading,
              success: saveState.isSuccess,
              message: saveState.isSuccess
                  ? t('Deck added successfully')
                  : saveState.error?.data?.message
          };

    const { dbDecks } = useSelector((state) => ({
        dbDecks: state.cards.decks
    }));

    const [selectedExpansion, setSelectedExpansion] = useState();
    const [selectedHouses, setSelectedHouses] = useState([null, null, null]);
    const [activeSlotIndex, setActiveSlotIndex] = useState(0);
    const [deckName, setDeckName] = useState('');
    const [selectedTokenDeckUuid, setSelectedTokenDeckUuid] = useState();
    const [selectedProphecyKey, setSelectedProphecyKey] = useState();
    const [sourceDeckSearch, setSourceDeckSearch] = useState('');
    const [showSetChangeModal, setShowSetChangeModal] = useState(false);
    const [pendingExpansion, setPendingExpansion] = useState();
    const [hoveredCard, setHoveredCard] = useState();
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
    const [activeHoverPanel, setActiveHoverPanel] = useState();
    const hoverPanelCloseTimerRef = useRef();
    const hasInitializedSaveStateRef = useRef(false);

    const selectedPods = useMemo(
        () =>
            selectedHouses
                .filter(Boolean)
                .map((selection) => `${selection.deckUuid}:${selection.house}`),
        [selectedHouses]
    );
    const selectedExpansionConfig = useMemo(
        () => Constants.Expansions.find((expansion) => expansion.value === selectedExpansion),
        [selectedExpansion]
    );
    const expansionRequiresToken = Boolean(selectedExpansionConfig?.tokenRequired);
    const expansionSupportsProphecy = Boolean(selectedExpansionConfig?.prophecySupported);

    const deckQueryArgs = useMemo(
        () => ({
            page: 1,
            pageSize: 999999,
            sort: 'lastUpdated',
            sortDir: 'desc',
            filter: [{ name: 'isAlliance', value: false }]
        }),
        []
    );
    useGetDecksQuery(deckQueryArgs);

    const decksByUuid = useMemo(() => {
        if (!dbDecks) {
            return {};
        }

        return dbDecks.reduce((acc, cur) => {
            acc[cur.uuid] = cur;
            return acc;
        }, {});
    }, [dbDecks]);

    const decks = useMemo(() => {
        if (!dbDecks) {
            return [];
        }

        const search = sourceDeckSearch.trim().toLowerCase();
        return dbDecks.filter((deck) => {
            if (deck.expansion != selectedExpansion) {
                return false;
            }

            if (deck.isAlliance) {
                return false;
            }

            if (!search) {
                return true;
            }

            return deck.name?.toLowerCase().includes(search);
        });
    }, [dbDecks, selectedExpansion, sourceDeckSearch]);

    const clearAllianceSelections = () => {
        setSelectedHouses([null, null, null]);
        setActiveSlotIndex(0);
        setSelectedTokenDeckUuid(undefined);
        setSelectedProphecyKey(undefined);
    };

    const handleExpansionChange = (nextExpansion) => {
        const nextValue = nextExpansion || undefined;
        if (nextValue === selectedExpansion) {
            return;
        }

        const hasSelections =
            selectedHouses.some(Boolean) ||
            Boolean(selectedTokenDeckUuid) ||
            Boolean(selectedProphecyKey);

        if (hasSelections) {
            setPendingExpansion(nextValue);
            setShowSetChangeModal(true);
            return;
        }

        setSelectedExpansion(nextValue);
    };

    const confirmExpansionChange = () => {
        clearAllianceSelections();
        setSelectedExpansion(pendingExpansion);
        setPendingExpansion(undefined);
        setShowSetChangeModal(false);
    };

    const cancelExpansionChange = () => {
        setPendingExpansion(undefined);
        setShowSetChangeModal(false);
    };

    useEffect(() => {
        if (hasInitializedSaveStateRef.current) {
            return;
        }

        hasInitializedSaveStateRef.current = true;
        saveState.reset();
    }, [saveState]);

    const availableProphecyDecks = useMemo(() => {
        if (!expansionSupportsProphecy) {
            return [];
        }

        const selectedDecks = selectedHouses
            .filter(Boolean)
            .map((selection) => decksByUuid[selection.deckUuid])
            .filter(Boolean);
        const deckOptions = new Map();

        for (const deck of selectedDecks) {
            const prophecyCards = deck.cards.filter(
                (card) => (card.card && card.card.type === 'prophecy') || card.prophecyId
            );

            if (prophecyCards.length === 0) {
                continue;
            }

            const prophecyEntries = prophecyCards
                .map((card) => ({
                    card: card.card,
                    key: `${deck.uuid}-${card.dbId}-${card.prophecyId || 'none'}`,
                    name:
                        card.card?.locale && card.card.locale[i18n.language]
                            ? card.card.locale[i18n.language].name
                            : card.card?.name || card.name || t('Unknown Prophecy')
                }))
                .sort((a, b) => a.name.localeCompare(b.name));

            deckOptions.set(deck.uuid, {
                deckName: deck.name,
                deckUuid: deck.uuid,
                prophecyCount: prophecyCards.length,
                prophecyEntries
            });
        }

        return Array.from(deckOptions.values()).sort((a, b) =>
            a.deckName.localeCompare(b.deckName)
        );
    }, [decksByUuid, expansionSupportsProphecy, i18n.language, selectedHouses, t]);

    const selectedProphecyDeck = useMemo(
        () =>
            availableProphecyDecks.find(
                (prophecyDeck) => prophecyDeck.deckUuid === selectedProphecyKey
            ),
        [availableProphecyDecks, selectedProphecyKey]
    );

    const availableTokenDecks = useMemo(() => {
        if (!expansionRequiresToken) {
            return [];
        }

        const selectedDecks = selectedHouses
            .filter(Boolean)
            .map((selection) => decksByUuid[selection.deckUuid])
            .filter(Boolean);
        const tokenDeckMap = new Map();

        for (const deck of selectedDecks) {
            const tokenCard = deck.cards.find(
                (card) =>
                    card.isNonDeck &&
                    card.card &&
                    card.card.type === 'token creature' &&
                    card.id !== 'the-tide'
            );

            if (!tokenCard) {
                continue;
            }

            tokenDeckMap.set(deck.uuid, {
                tokenCard: tokenCard.card,
                deckName: deck.name,
                deckUuid: deck.uuid,
                tokenName:
                    tokenCard.card.locale && tokenCard.card.locale[i18n.language]
                        ? tokenCard.card.locale[i18n.language].name
                        : tokenCard.card.name,
                tokenId: tokenCard.id
            });
        }

        return Array.from(tokenDeckMap.values()).sort((a, b) =>
            a.deckName.localeCompare(b.deckName)
        );
    }, [decksByUuid, expansionRequiresToken, i18n.language, selectedHouses]);

    const selectedTokenDeck = useMemo(
        () => availableTokenDecks.find((tokenDeck) => tokenDeck.deckUuid === selectedTokenDeckUuid),
        [availableTokenDecks, selectedTokenDeckUuid]
    );

    useEffect(() => {
        if (availableProphecyDecks.length === 0) {
            if (selectedProphecyKey) {
                setSelectedProphecyKey(undefined);
            }
            return;
        }

        if (
            selectedProphecyKey &&
            !availableProphecyDecks.some(
                (prophecyDeck) => prophecyDeck.deckUuid === selectedProphecyKey
            )
        ) {
            setSelectedProphecyKey(undefined);
            return;
        }

        if (!selectedProphecyKey && availableProphecyDecks.length === 1) {
            setSelectedProphecyKey(availableProphecyDecks[0].deckUuid);
        }
    }, [availableProphecyDecks, selectedProphecyKey]);

    useEffect(() => {
        if (!expansionRequiresToken) {
            if (selectedTokenDeckUuid) {
                setSelectedTokenDeckUuid(undefined);
            }
            return;
        }

        if (
            selectedTokenDeckUuid &&
            !availableTokenDecks.some((tokenDeck) => tokenDeck.deckUuid === selectedTokenDeckUuid)
        ) {
            setSelectedTokenDeckUuid(undefined);
            return;
        }

        if (!selectedTokenDeckUuid && availableTokenDecks.length === 1) {
            setSelectedTokenDeckUuid(availableTokenDecks[0].deckUuid);
        }
    }, [availableTokenDecks, expansionRequiresToken, selectedTokenDeckUuid]);

    const getSaveValidation = () => {
        const needsToken = expansionRequiresToken;

        const selectedHouseCount = selectedPods.length;
        const remaining = Math.max(0, 3 - selectedHouseCount);
        const requiresProphecySelection =
            availableProphecyDecks.length > 1 && !selectedProphecyDeck;

        if (saveState.isLoading) {
            return {
                disabled: true,
                selectedHouseCount,
                statusText: t('Saving alliance deck...')
            };
        }

        if (saveState.isSuccess) {
            return {
                disabled: true,
                selectedHouseCount,
                statusText: t('Saved. Returning to decks...')
            };
        }

        if (saveState.isError) {
            return {
                disabled: false,
                selectedHouseCount,
                statusText:
                    saveState.error?.data?.message ||
                    t('Save failed. Check your selections and try again.')
            };
        }

        const prophecyStatusText =
            expansionSupportsProphecy && availableProphecyDecks.length > 0 && selectedProphecyDeck
                ? t('Prophecy source selected')
                : undefined;

        if (remaining > 0) {
            return {
                disabled: true,
                selectedHouseCount,
                statusText: t('Select {{count}} more house(s)', { count: remaining }),
                prophecyStatusText
            };
        }

        if (!deckName) {
            return {
                disabled: true,
                selectedHouseCount,
                statusText: t('Enter a deck name'),
                prophecyStatusText
            };
        }

        if (needsToken && !selectedTokenDeck) {
            return {
                disabled: true,
                selectedHouseCount,
                statusText: t('Select a token source deck'),
                prophecyStatusText
            };
        }

        if (requiresProphecySelection) {
            return {
                disabled: true,
                selectedHouseCount,
                statusText: t('Select a prophecy source deck to save')
            };
        }

        return {
            disabled: false,
            selectedHouseCount,
            statusText: t('Ready to save'),
            prophecyStatusText
        };
    };

    const saveValidation = getSaveValidation();
    const housesComplete = saveValidation.selectedHouseCount === 3;
    const tokenComplete = !expansionRequiresToken || Boolean(selectedTokenDeck);
    const prophecyRequired = availableProphecyDecks.length > 1;
    const prophecyComplete = !prophecyRequired || Boolean(selectedProphecyDeck);

    const handleSave = () => {
        const allianceData = {
            name: deckName,
            pods: selectedPods,
            token: selectedTokenDeck ? { id: selectedTokenDeck.tokenId } : undefined,
            tokenSourceDeck: selectedTokenDeck?.deckUuid
        };

        if (expansionSupportsProphecy && selectedProphecyDeck) {
            allianceData.prophecySourceDeck = selectedProphecyDeck.deckUuid;
        }

        saveAllianceDeck(allianceData);
    };

    const getCardsForSelection = (selection) => {
        if (!selection) {
            return [];
        }

        const sourceDeck = decksByUuid[selection.deckUuid];
        if (!sourceDeck) {
            return [];
        }

        return sourceDeck.cards
            .filter((card) => card.card?.house === selection.house && !card.isNonDeck)
            .sort((a, b) => a.card.name.localeCompare(b.card.name))
            .flatMap((card) =>
                Array.from({ length: card.count || 1 }, (_, index) => ({
                    card: card.card,
                    key: `${card.dbId}-${index}`,
                    name:
                        card.card.locale && card.card.locale[i18n.language]
                            ? card.card.locale[i18n.language].name
                            : card.card.name
                }))
            );
    };

    const getDeckHousePreviewCards = (deck, house) => {
        if (!deck || !house) {
            return [];
        }

        return deck.cards
            .filter((card) => card.card?.house === house && !card.isNonDeck)
            .sort((a, b) => a.card.name.localeCompare(b.card.name))
            .map((card) => ({
                card: card.card,
                count: card.count || 1,
                key: `${deck.uuid}-${house}-${card.dbId}`,
                name:
                    card.card.locale && card.card.locale[i18n.language]
                        ? card.card.locale[i18n.language].name
                        : card.card.name
            }));
    };

    const updateHoverPosition = (event) => {
        let y = event.clientY;
        const yPlusHeight = y + 420;

        if (yPlusHeight >= window.innerHeight) {
            y -= yPlusHeight - window.innerHeight;
        }

        setHoverPosition({ x: event.clientX + 5, y });
    };

    const openHoverPanel = (panelKey) => {
        if (hoverPanelCloseTimerRef.current) {
            clearTimeout(hoverPanelCloseTimerRef.current);
        }

        setActiveHoverPanel(panelKey);
    };

    const closeHoverPanel = () => {
        if (hoverPanelCloseTimerRef.current) {
            clearTimeout(hoverPanelCloseTimerRef.current);
        }

        hoverPanelCloseTimerRef.current = setTimeout(() => {
            setActiveHoverPanel(undefined);
            setHoveredCard(undefined);
        }, 140);
    };

    const chooseHouseForActiveSlot = (deck, house) => {
        const selectedSlotIndex = selectedHouses.findIndex(
            (selection) =>
                selection && selection.deckUuid === deck.uuid && selection.house === house
        );

        if (selectedSlotIndex !== -1) {
            const nextSelections = [...selectedHouses];
            nextSelections[selectedSlotIndex] = null;
            setSelectedHouses(nextSelections);
            setActiveSlotIndex(selectedSlotIndex);
            return;
        }

        const blockedByOtherSlot = selectedHouses.some(
            (selection, index) =>
                index !== activeSlotIndex &&
                selection &&
                selection.house === house &&
                selection.deckUuid !== deck.uuid
        );

        if (blockedByOtherSlot) {
            return;
        }

        const nextSelections = [...selectedHouses];
        nextSelections[activeSlotIndex] = {
            deckName: deck.name,
            deckUuid: deck.uuid,
            house
        };

        setSelectedHouses(nextSelections);

        const nextEmptyIndex = nextSelections.findIndex((selection) => !selection);
        if (nextEmptyIndex !== -1) {
            setActiveSlotIndex(nextEmptyIndex);
        }
    };

    let decksList;

    if (!selectedExpansion) {
        decksList = (
            <div className='rounded-md border border-border/70 bg-surface-secondary/45 px-4 py-6 text-center'>
                <div className='text-sm text-foreground'>{t('Select a set to see decks')}</div>
                <div className='mt-1 text-xs text-muted'>
                    {t('Then choose houses from decks to build your alliance')}
                </div>
            </div>
        );
    } else if (!decks || decks.length === 0) {
        decksList = <AlertPanel type='info'>There are no decks from this set.</AlertPanel>;
    } else {
        decksList = decks.map((deck) => {
            const prophecyCards = deck.cards.filter(
                (card) => (card.card && card.card.type === 'prophecy') || card.prophecyId
            );
            const hasToken = expansionRequiresToken
                ? deck.cards.some(
                      (card) =>
                          card.isNonDeck &&
                          card.card &&
                          card.card.type === 'token creature' &&
                          card.id !== 'the-tide'
                  )
                : false;
            const hasProphecies = expansionSupportsProphecy && prophecyCards.length > 0;

            return (
                <div
                    className='mt-2 flex flex-col rounded-md border border-border/70 bg-surface-secondary/60 p-2'
                    key={deck.id}
                >
                    <div className='flex items-center gap-2'>
                        <span>{deck.name}</span>
                        {hasProphecies && (
                            <span className='inline-flex rounded-md border border-border/70 bg-surface-secondary px-2 py-0.5 text-xs uppercase tracking-wide text-muted'>
                                {t('Prophecy available')}
                            </span>
                        )}
                        {hasToken && (
                            <span className='inline-flex rounded-md border border-border/70 bg-surface-secondary px-2 py-0.5 text-xs uppercase tracking-wide text-muted'>
                                {t('Token available')}
                            </span>
                        )}
                    </div>
                    <div className='mt-2 flex flex-wrap gap-2'>
                        {[...deck.houses].sort().map((house) => {
                            const isSelectedInAnySlot = selectedHouses.some(
                                (selection) =>
                                    selection &&
                                    selection.deckUuid === deck.uuid &&
                                    selection.house === house
                            );
                            const isSelectedInActiveSlot =
                                selectedHouses[activeSlotIndex]?.deckUuid === deck.uuid &&
                                selectedHouses[activeSlotIndex]?.house === house;
                            const isSelectedElsewhere = selectedHouses.some(
                                (selection) =>
                                    selection &&
                                    selection.house === house &&
                                    selection.deckUuid !== deck.uuid
                            );
                            const isDisabled = isSelectedElsewhere && !isSelectedInAnySlot;
                            const houseCards = getDeckHousePreviewCards(deck, house);

                            const chipClasses = `inline-flex items-center rounded-md border px-2 py-1 text-xs transition ${
                                isDisabled
                                    ? 'cursor-not-allowed border-border/50 bg-surface-secondary/50 text-muted opacity-55'
                                    : isSelectedInActiveSlot || isSelectedInAnySlot
                                    ? 'border-accent/70 bg-accent/20 text-foreground'
                                    : 'cursor-pointer border-border/70 bg-surface-secondary/75 text-foreground hover:bg-accent/10'
                            }`;

                            return (
                                <div
                                    key={house}
                                    className='relative'
                                    onMouseEnter={() =>
                                        openHoverPanel(`house:${deck.uuid}:${house}`)
                                    }
                                    onMouseLeave={closeHoverPanel}
                                >
                                    <button
                                        type='button'
                                        className={chipClasses}
                                        disabled={isDisabled}
                                        onClick={() => chooseHouseForActiveSlot(deck, house)}
                                    >
                                        <img
                                            src={Constants.HouseIconPaths[house]}
                                            className='mr-1 h-4 w-4'
                                            alt={getHouseLabel(house)}
                                        />
                                        <span>{getHouseLabel(house)}</span>
                                    </button>
                                    <div
                                        className={`absolute left-0 top-full -mt-px z-20 min-w-60 max-w-80 rounded-md border border-border/70 bg-surface/95 p-2 shadow-lg ${
                                            activeHoverPanel === `house:${deck.uuid}:${house}`
                                                ? 'block'
                                                : 'hidden'
                                        }`}
                                        onMouseEnter={() =>
                                            openHoverPanel(`house:${deck.uuid}:${house}`)
                                        }
                                        onMouseLeave={closeHoverPanel}
                                    >
                                        <div className='mb-1 text-xs uppercase tracking-wide text-muted'>
                                            {getHouseLabel(house)}
                                        </div>
                                        <div className='max-h-56 space-y-1 overflow-y-auto pr-1'>
                                            {houseCards.map((houseCard) => (
                                                <button
                                                    key={houseCard.key}
                                                    type='button'
                                                    className='pointer-events-auto flex w-full items-center justify-between rounded-sm px-1 py-0.5 text-left text-xs text-foreground hover:bg-accent/10'
                                                    onMouseEnter={(event) => {
                                                        setHoveredCard(houseCard.card);
                                                        updateHoverPosition(event);
                                                    }}
                                                    onMouseMove={updateHoverPosition}
                                                    onMouseLeave={() => setHoveredCard(undefined)}
                                                >
                                                    <span className='truncate'>
                                                        {houseCard.name}
                                                    </span>
                                                    {houseCard.count > 1 && (
                                                        <span className='ml-2 shrink-0 text-muted'>
                                                            x{houseCard.count}
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        });
    }

    return (
        <div className='h-auto lg:h-[calc(100vh-65px)] lg:overflow-hidden'>
            <CardHoverPreview card={hoveredCard} position={hoverPosition} />
            <div className='grid min-h-0 gap-3 lg:h-full lg:grid-cols-2'>
                <div className='min-h-0'>
                    <Panel title={t('Alliance')} className='h-full !mb-0'>
                        <ApiStatus state={apiState} onClose={() => saveState.reset()} />
                        <div className='flex h-full min-h-0 flex-col'>
                            <div className='min-h-0 flex-1 space-y-3 overflow-y-auto pb-20 pr-1'>
                                <div className='space-y-2'>
                                    <label className='mb-1 block text-sm text-foreground'>
                                        {t('House Selection Builder')}
                                    </label>
                                    <div
                                        className={`grid gap-2 sm:grid-cols-2 ${
                                            expansionRequiresToken && expansionSupportsProphecy
                                                ? 'xl:grid-cols-5'
                                                : expansionRequiresToken ||
                                                  expansionSupportsProphecy
                                                ? 'xl:grid-cols-4'
                                                : 'xl:grid-cols-3'
                                        }`}
                                    >
                                        {[0, 1, 2].map((slotIndex) => {
                                            const selection = selectedHouses[slotIndex];
                                            const isActive = activeSlotIndex === slotIndex;

                                            return (
                                                <button
                                                    key={slotIndex}
                                                    type='button'
                                                    className={`relative rounded-md border p-2 text-left transition ${
                                                        isActive
                                                            ? 'border-accent/70 bg-accent/10'
                                                            : 'border-border/70 bg-surface-secondary/65'
                                                    }`}
                                                    onClick={() => setActiveSlotIndex(slotIndex)}
                                                >
                                                    <div className='text-xs uppercase tracking-wide text-muted'>
                                                        {t('House')} {slotIndex + 1}
                                                    </div>
                                                    {selection ? (
                                                        <div className='mt-1 space-y-1'>
                                                            <button
                                                                type='button'
                                                                aria-label={t('Remove')}
                                                                className='absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-sm border border-border/70 bg-surface/60 text-xs leading-none text-muted transition hover:border-accent/40 hover:bg-accent/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50'
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    setSelectedHouses(
                                                                        (currentSelections) => {
                                                                            const nextSelections = [
                                                                                ...currentSelections
                                                                            ];
                                                                            nextSelections[
                                                                                slotIndex
                                                                            ] = null;
                                                                            return nextSelections;
                                                                        }
                                                                    );
                                                                    setActiveSlotIndex(slotIndex);
                                                                }}
                                                            >
                                                                &times;
                                                            </button>
                                                            <div className='flex items-center gap-1.5 text-sm text-foreground'>
                                                                <img
                                                                    src={
                                                                        Constants.HouseIconPaths[
                                                                            selection.house
                                                                        ]
                                                                    }
                                                                    alt={getHouseLabel(
                                                                        selection.house
                                                                    )}
                                                                    className='h-4 w-4'
                                                                />
                                                                <span>
                                                                    {getHouseLabel(selection.house)}
                                                                </span>
                                                            </div>
                                                            <div className='truncate text-xs text-muted'>
                                                                {selection.deckName}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='mt-1 text-xs text-muted'>
                                                            {t('Select a house')}
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}

                                        {expansionRequiresToken && (
                                            <div className='relative rounded-md border border-border/70 bg-surface-secondary/65 p-2 text-left'>
                                                <div className='text-xs uppercase tracking-wide text-muted'>
                                                    {t('Token')}
                                                </div>
                                                {selectedTokenDeck ? (
                                                    <div className='mt-1 space-y-1'>
                                                        <button
                                                            type='button'
                                                            aria-label={t('Remove')}
                                                            disabled={
                                                                availableTokenDecks.length === 1
                                                            }
                                                            className={`absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-sm border text-xs leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                                                                availableTokenDecks.length === 1
                                                                    ? 'cursor-not-allowed border-border/50 bg-surface/40 text-muted/60'
                                                                    : 'border-border/70 bg-surface/60 text-muted hover:border-accent/40 hover:bg-accent/10 hover:text-foreground'
                                                            }`}
                                                            onClick={() =>
                                                                setSelectedTokenDeckUuid(undefined)
                                                            }
                                                        >
                                                            &times;
                                                        </button>
                                                        <div className='text-sm text-foreground'>
                                                            {selectedTokenDeck.tokenName}
                                                        </div>
                                                        <div className='truncate text-xs text-muted'>
                                                            {selectedTokenDeck.deckName}
                                                        </div>
                                                    </div>
                                                ) : availableTokenDecks.length > 0 ? (
                                                    <div className='mt-1 text-xs text-muted'>
                                                        {t('Select a token source')}
                                                    </div>
                                                ) : (
                                                    <div className='mt-1 text-xs text-muted'>
                                                        {t('No token source available')}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {expansionSupportsProphecy && (
                                            <div className='relative rounded-md border border-border/70 bg-surface-secondary/65 p-2 text-left'>
                                                <div className='text-xs uppercase tracking-wide text-muted'>
                                                    {t('Prophecy')}
                                                </div>
                                                {selectedProphecyDeck ? (
                                                    <div className='mt-1 space-y-1'>
                                                        <button
                                                            type='button'
                                                            aria-label={t('Remove')}
                                                            disabled={
                                                                availableProphecyDecks.length === 1
                                                            }
                                                            className={`absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-sm border text-xs leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
                                                                availableProphecyDecks.length === 1
                                                                    ? 'cursor-not-allowed border-border/50 bg-surface/40 text-muted/60'
                                                                    : 'border-border/70 bg-surface/60 text-muted hover:border-accent/40 hover:bg-accent/10 hover:text-foreground'
                                                            }`}
                                                            onClick={() =>
                                                                setSelectedProphecyKey(undefined)
                                                            }
                                                        >
                                                            &times;
                                                        </button>
                                                        <div className='text-sm text-foreground'>
                                                            {t('All prophecies')}
                                                        </div>
                                                        <div className='truncate text-xs text-muted'>
                                                            {selectedProphecyDeck.deckName}
                                                        </div>
                                                    </div>
                                                ) : availableProphecyDecks.length > 0 ? (
                                                    <div className='mt-1 text-xs text-muted'>
                                                        {t('Select a prophecy source')}
                                                    </div>
                                                ) : (
                                                    <div className='mt-1 text-xs text-muted'>
                                                        {t('No prophecy required')}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <p className='text-xs text-muted'>
                                        {t('Pick 3 houses; each pulls cards from its source deck.')}
                                    </p>
                                </div>

                                <div className='grid gap-3 sm:grid-cols-2'>
                                    <div>
                                        <label className='mb-1 block text-sm text-foreground'>
                                            <Trans>Deck Name</Trans>
                                        </label>
                                        <div className='px-0.5'>
                                            <Input
                                                className='w-full'
                                                value={deckName}
                                                onChange={(event) =>
                                                    setDeckName(event.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='mb-1 block text-sm text-foreground'>
                                            <Trans>Set</Trans>
                                        </label>
                                        <Select
                                            value={selectedExpansion || ''}
                                            onChange={handleExpansionChange}
                                        >
                                            <Select.Trigger>
                                                <Select.Value />
                                                <Select.Indicator />
                                            </Select.Trigger>
                                            <Select.Popover>
                                                <ListBox>
                                                    <ListBox.Item
                                                        id=''
                                                        textValue={t('Please select')}
                                                    >
                                                        {t('Please select')}
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>
                                                    {Constants.Expansions.map((expansion) => (
                                                        <ListBox.Item
                                                            key={expansion.value}
                                                            id={expansion.value}
                                                            textValue={expansion.label}
                                                        >
                                                            {expansion.label}
                                                            <ListBox.ItemIndicator />
                                                        </ListBox.Item>
                                                    ))}
                                                </ListBox>
                                            </Select.Popover>
                                        </Select>
                                    </div>
                                </div>

                                <label className='mb-1 block text-sm text-foreground'>
                                    {t('Choose houses from decks')}
                                </label>
                                <div className='px-0.5'>
                                    <Input
                                        className='mb-2 w-full'
                                        value={sourceDeckSearch}
                                        placeholder={t('Filter decks by name')}
                                        onChange={(event) =>
                                            setSourceDeckSearch(event.target.value)
                                        }
                                    />
                                </div>
                                {expansionRequiresToken &&
                                    (availableTokenDecks.length > 1 || selectedTokenDeck) && (
                                        <div className='mb-2 rounded-md border border-border/70 bg-surface-secondary/55 p-2'>
                                            <label className='mb-2 block text-sm text-foreground'>
                                                {t('Token Source Deck')}
                                            </label>
                                            <div className='flex flex-wrap gap-2'>
                                                {availableTokenDecks.map((tokenDeck) => {
                                                    const isSelected =
                                                        selectedTokenDeck?.deckUuid ===
                                                        tokenDeck.deckUuid;
                                                    return (
                                                        <div
                                                            key={tokenDeck.deckUuid}
                                                            className='relative'
                                                            onMouseEnter={() =>
                                                                openHoverPanel(
                                                                    `token:${tokenDeck.deckUuid}`
                                                                )
                                                            }
                                                            onMouseLeave={closeHoverPanel}
                                                        >
                                                            <button
                                                                type='button'
                                                                className={`rounded-md border px-2 py-1 text-left text-xs transition ${
                                                                    isSelected
                                                                        ? 'border-accent/70 bg-accent/20 text-foreground'
                                                                        : 'border-border/70 bg-surface-secondary/75 text-foreground hover:bg-accent/10'
                                                                }`}
                                                                onClick={() =>
                                                                    setSelectedTokenDeckUuid(
                                                                        isSelected
                                                                            ? undefined
                                                                            : tokenDeck.deckUuid
                                                                    )
                                                                }
                                                            >
                                                                <span className='block font-medium'>
                                                                    {tokenDeck.deckName}
                                                                </span>
                                                                <span className='block text-xs text-muted'>
                                                                    {tokenDeck.tokenName}
                                                                </span>
                                                            </button>
                                                            <div
                                                                className={`absolute left-0 top-full -mt-px z-20 min-w-60 max-w-80 rounded-md border border-border/70 bg-surface/95 p-2 shadow-lg ${
                                                                    activeHoverPanel ===
                                                                    `token:${tokenDeck.deckUuid}`
                                                                        ? 'block'
                                                                        : 'hidden'
                                                                }`}
                                                                onMouseEnter={() =>
                                                                    openHoverPanel(
                                                                        `token:${tokenDeck.deckUuid}`
                                                                    )
                                                                }
                                                                onMouseLeave={closeHoverPanel}
                                                            >
                                                                <div className='mb-1 text-xs uppercase tracking-wide text-muted'>
                                                                    {t('Token')}
                                                                </div>
                                                                <button
                                                                    type='button'
                                                                    className='pointer-events-auto flex w-full items-center justify-between rounded-sm px-1 py-0.5 text-left text-xs text-foreground hover:bg-accent/10'
                                                                    onMouseEnter={(event) => {
                                                                        setHoveredCard(
                                                                            tokenDeck.tokenCard
                                                                        );
                                                                        updateHoverPosition(event);
                                                                    }}
                                                                    onMouseMove={
                                                                        updateHoverPosition
                                                                    }
                                                                    onMouseLeave={() =>
                                                                        setHoveredCard(undefined)
                                                                    }
                                                                >
                                                                    <span className='truncate'>
                                                                        {tokenDeck.tokenName}
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                {expansionSupportsProphecy &&
                                    (availableProphecyDecks.length > 1 || selectedProphecyDeck) && (
                                        <div className='mb-2 rounded-md border border-border/70 bg-surface-secondary/55 p-2'>
                                            <label className='mb-2 block text-sm text-foreground'>
                                                {t('Prophecy Source Deck')}
                                            </label>
                                            <div className='flex flex-wrap gap-2'>
                                                {availableProphecyDecks.map((prophecyDeck) => {
                                                    const isSelected =
                                                        selectedProphecyDeck?.deckUuid ===
                                                        prophecyDeck.deckUuid;
                                                    return (
                                                        <div
                                                            key={prophecyDeck.deckUuid}
                                                            className='relative'
                                                            onMouseEnter={() =>
                                                                openHoverPanel(
                                                                    `prophecy:${prophecyDeck.deckUuid}`
                                                                )
                                                            }
                                                            onMouseLeave={closeHoverPanel}
                                                        >
                                                            <button
                                                                type='button'
                                                                className={`rounded-md border px-2 py-1 text-left text-xs transition ${
                                                                    isSelected
                                                                        ? 'border-accent/70 bg-accent/20 text-foreground'
                                                                        : 'border-border/70 bg-surface-secondary/75 text-foreground hover:bg-accent/10'
                                                                }`}
                                                                onClick={() =>
                                                                    setSelectedProphecyKey(
                                                                        isSelected
                                                                            ? undefined
                                                                            : prophecyDeck.deckUuid
                                                                    )
                                                                }
                                                            >
                                                                <span className='block font-medium'>
                                                                    {prophecyDeck.deckName}
                                                                </span>
                                                                <span className='block text-xs text-muted'>
                                                                    {t(
                                                                        '{{count}} prophecy card(s)',
                                                                        {
                                                                            count: prophecyDeck.prophecyCount
                                                                        }
                                                                    )}
                                                                </span>
                                                            </button>
                                                            <div
                                                                className={`absolute left-0 top-full -mt-px z-20 min-w-60 max-w-80 rounded-md border border-border/70 bg-surface/95 p-2 shadow-lg ${
                                                                    activeHoverPanel ===
                                                                    `prophecy:${prophecyDeck.deckUuid}`
                                                                        ? 'block'
                                                                        : 'hidden'
                                                                }`}
                                                                onMouseEnter={() =>
                                                                    openHoverPanel(
                                                                        `prophecy:${prophecyDeck.deckUuid}`
                                                                    )
                                                                }
                                                                onMouseLeave={closeHoverPanel}
                                                            >
                                                                <div className='mb-1 text-xs uppercase tracking-wide text-muted'>
                                                                    {t('Prophecies')}
                                                                </div>
                                                                <div className='max-h-56 space-y-1 overflow-y-auto pr-1'>
                                                                    {prophecyDeck.prophecyEntries.map(
                                                                        (prophecyEntry) => (
                                                                            <button
                                                                                key={
                                                                                    prophecyEntry.key
                                                                                }
                                                                                type='button'
                                                                                className='pointer-events-auto flex w-full items-center justify-between rounded-sm px-1 py-0.5 text-left text-xs text-foreground hover:bg-accent/10'
                                                                                onMouseEnter={(
                                                                                    event
                                                                                ) => {
                                                                                    setHoveredCard(
                                                                                        prophecyEntry.card
                                                                                    );
                                                                                    updateHoverPosition(
                                                                                        event
                                                                                    );
                                                                                }}
                                                                                onMouseMove={
                                                                                    updateHoverPosition
                                                                                }
                                                                                onMouseLeave={() =>
                                                                                    setHoveredCard(
                                                                                        undefined
                                                                                    )
                                                                                }
                                                                            >
                                                                                <span className='truncate'>
                                                                                    {
                                                                                        prophecyEntry.name
                                                                                    }
                                                                                </span>
                                                                            </button>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                <div className='pb-2 pt-1'>{decksList}</div>
                            </div>
                        </div>
                        <div className='sticky bottom-0 z-10 border-t border-border/70 bg-surface/95 px-3 py-2 backdrop-blur-sm'>
                            <div className='flex items-center justify-between gap-3'>
                                <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-xs'>
                                    <span
                                        className={`inline-flex items-center gap-1 ${
                                            housesComplete ? 'text-emerald-500' : 'text-rose-500'
                                        }`}
                                    >
                                        <span aria-hidden='true'>
                                            {housesComplete ? '\u2713' : '\u2715'}
                                        </span>
                                        <span>
                                            {t('Houses')}: {saveValidation.selectedHouseCount}/3
                                        </span>
                                    </span>
                                    {expansionRequiresToken && (
                                        <span
                                            className={`inline-flex items-center gap-1 ${
                                                tokenComplete ? 'text-emerald-500' : 'text-rose-500'
                                            }`}
                                        >
                                            <span aria-hidden='true'>
                                                {tokenComplete ? '\u2713' : '\u2715'}
                                            </span>
                                            <span>
                                                {selectedTokenDeck
                                                    ? t('Token source selected')
                                                    : t('Select token source')}
                                            </span>
                                        </span>
                                    )}
                                    {expansionSupportsProphecy &&
                                        availableProphecyDecks.length > 0 && (
                                            <span
                                                className={`inline-flex items-center gap-1 ${
                                                    prophecyComplete
                                                        ? 'text-emerald-500'
                                                        : 'text-rose-500'
                                                }`}
                                            >
                                                <span aria-hidden='true'>
                                                    {prophecyComplete ? '\u2713' : '\u2715'}
                                                </span>
                                                <span>
                                                    {prophecyRequired
                                                        ? selectedProphecyDeck
                                                            ? t('Prophecy source selected')
                                                            : t('Select prophecy source')
                                                        : t('Prophecy source auto-selected')}
                                                </span>
                                            </span>
                                        )}
                                    <span
                                        className={`inline-flex items-center gap-1 ${
                                            saveState.isError || saveValidation.disabled
                                                ? 'text-rose-500'
                                                : 'text-emerald-500'
                                        }`}
                                    >
                                        <span aria-hidden='true'>
                                            {saveState.isError || saveValidation.disabled
                                                ? '\u2715'
                                                : '\u2713'}
                                        </span>
                                        <span>{saveValidation.statusText}</span>
                                    </span>
                                </div>
                                <Button
                                    variant='secondary'
                                    isDisabled={saveValidation.disabled || saveState.isLoading}
                                    isPending={saveState.isLoading}
                                    onPress={handleSave}
                                >
                                    <Trans>Save alliance deck</Trans>
                                </Button>
                            </div>
                            <div className='mt-1 text-xs text-muted'>
                                {saveState.isSuccess
                                    ? t('Your alliance deck was created.')
                                    : t(
                                          'Saving creates this alliance deck and returns you to the Decks page.'
                                      )}
                            </div>
                        </div>
                    </Panel>
                </div>

                <div className='min-h-0'>
                    <Panel title={deckName || t('Alliance Preview')} className='h-full !mb-0'>
                        <div className='min-h-0 overflow-auto'>
                            {expansionRequiresToken && selectedTokenDeck && (
                                <div className='mb-2 text-xs text-muted'>
                                    {t('Token source')}: {selectedTokenDeck.deckName}
                                </div>
                            )}
                            {expansionSupportsProphecy && selectedProphecyDeck && (
                                <div className='mb-2 text-xs text-muted'>
                                    {t('Prophecy source')}: {selectedProphecyDeck.deckName}
                                </div>
                            )}
                            <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
                                {[0, 1, 2].map((slotIndex) => {
                                    const selection = selectedHouses[slotIndex];
                                    const cards = getCardsForSelection(selection);

                                    if (!selection) {
                                        return (
                                            <div
                                                key={slotIndex}
                                                className='rounded-md border border-dashed border-border/70 bg-surface-secondary/45 p-3'
                                            >
                                                <div className='text-sm text-muted'>
                                                    {t('House')} {slotIndex + 1}
                                                </div>
                                                <div className='mt-2 text-xs text-muted'>
                                                    {t('Select a house')}
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={slotIndex}
                                            className='rounded-md border border-border/70 bg-surface-secondary/55 p-3'
                                        >
                                            <div className='flex items-center gap-2 text-sm text-foreground'>
                                                <img
                                                    src={Constants.HouseIconPaths[selection.house]}
                                                    alt={getHouseLabel(selection.house)}
                                                    className='h-5 w-5'
                                                />
                                                <span>{getHouseLabel(selection.house)}</span>
                                            </div>
                                            <div className='mt-1 truncate text-xs text-muted'>
                                                {selection.deckName}
                                            </div>
                                            <div className='mt-2 space-y-1 text-sm'>
                                                {cards.length > 0 ? (
                                                    cards.map((card) => (
                                                        <div
                                                            key={card.key}
                                                            className='deck-card-link'
                                                            onMouseEnter={(event) => {
                                                                setHoveredCard(card.card);
                                                                updateHoverPosition(event);
                                                            }}
                                                            onMouseMove={updateHoverPosition}
                                                            onMouseLeave={() =>
                                                                setHoveredCard(undefined)
                                                            }
                                                        >
                                                            {card.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className='text-xs text-muted'>
                                                        {t('No cards available')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>

            <HeroModal.Backdrop isOpen={showSetChangeModal} onOpenChange={setShowSetChangeModal}>
                <HeroModal.Container placement='center'>
                    <HeroModal.Dialog className='sm:max-w-md'>
                        <HeroModal.CloseTrigger />
                        <HeroModal.Header>
                            <HeroModal.Heading>{t('Change Set')}</HeroModal.Heading>
                        </HeroModal.Header>
                        <HeroModal.Body>
                            <p className='text-sm text-muted'>
                                {t(
                                    'Changing set will clear your current house, prophecy and token selections.'
                                )}
                            </p>
                        </HeroModal.Body>
                        <HeroModal.Footer>
                            <Button variant='secondary' onPress={cancelExpansionChange}>
                                {t('Cancel')}
                            </Button>
                            <Button variant='primary' onPress={confirmExpansionChange}>
                                {t('Continue')}
                            </Button>
                        </HeroModal.Footer>
                    </HeroModal.Dialog>
                </HeroModal.Container>
            </HeroModal.Backdrop>
        </div>
    );
};

AllianceBuilderPage.displayName = 'AllianceBuilder';

export default AllianceBuilderPage;
