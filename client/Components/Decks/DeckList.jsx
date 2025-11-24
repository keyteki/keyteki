import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { useTranslation, Trans } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Button from '../HeroUI/Button';
import {
    Checkbox,
    CheckboxGroup,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Pagination,
    Accordion,
    AccordionItem
} from '@heroui/react';
import ReactTable from '../Table/ReactTable';
import CardBack from './CardBack.jsx';
import DeckStatus from './DeckStatus';
import DeckSummary from './DeckSummary';
import { Constants } from '../../constants';
import AmberImage from '../../assets/img/enhancements/amberui.png';
import CaptureImage from '../../assets/img/enhancements/captureui.png';
import DrawImage from '../../assets/img/enhancements/drawui.png';
import DamageImage from '../../assets/img/enhancements/damageui.png';
import DiscardImage from '../../assets/img/enhancements/discardui.png';
import {
    useLoadDecksQuery,
    useLoadStandaloneDecksQuery,
    useDeleteDeckMutation
} from '../../redux/slices/apiSlice';
import { selectDeckReducer } from '../../redux/slices/cardsSlice';

const DeckList = ({ deckFilter, onDeckSelected, standaloneDecks = false, mode = 'table' }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [expandedDeckId, setExpandedDeckId] = useState(null);
    const [deleteConfirmDeck, setDeleteConfirmDeck] = useState(null);
    const [deleteDeck] = useDeleteDeckMutation();
    const selectedDeck = useSelector((state) =>
        standaloneDecks ? null : state.cards.selectedDeck
    );

    const deckFilterKey = JSON.stringify(deckFilter || {});
    const accordionQueryParams = useMemo(() => {
        const params = {
            pageSize,
            page,
            sort: 'lastUpdated',
            sortDir: 'desc'
        };

        const filters = [];
        const df = deckFilterKey ? JSON.parse(deckFilterKey) : null;
        if (df) {
            for (const [k, v] of Object.entries(df)) {
                filters.push({ name: k, value: v });
            }
        }
        if (filters.length > 0) {
            params.filter = filters;
        }
        return params;
    }, [page, pageSize, deckFilterKey]);

    const accordionQuery = useLoadDecksQuery(accordionQueryParams, {
        skip: mode !== 'accordion' || standaloneDecks,
        refetchOnMountOrArgChange: true
    });

    const cardsById = useSelector((state) => state.cards.cards || {});

    const enrichDeck = useMemo(
        () => (deck) => {
            if (!deck || !Array.isArray(deck.cards)) return deck;
            const mappedCards = deck.cards.map((c) => {
                const base = cardsById[c.id] ? { ...cardsById[c.id] } : {};
                const result = {
                    count: c.count,
                    card: base,
                    id: c.id,
                    maverick: c.maverick,
                    anomaly: c.anomaly,
                    house: c.house,
                    image: c.image,
                    enhancements: c.enhancements,
                    dbId: c.dbId,
                    prophecyId: c.prophecyId,
                    isNonDeck: c.isNonDeck
                };
                result.card.image = c.image || c.id;
                if (c.maverick) {
                    result.card.house = c.maverick;
                    result.card.maverick = c.maverick;
                } else if (c.anomaly) {
                    result.card.house = c.anomaly;
                    result.card.anomaly = c.anomaly;
                } else if (c.house) {
                    result.card.house = c.house;
                }
                if (c.image) {
                    result.card.image = c.image;
                }
                if (c.enhancements) {
                    result.card.enhancements = c.enhancements;
                }
                return result;
            });

            let hasEnhancementsSet = true;
            if (mappedCards.some((c) => c.enhancements && c.enhancements[0] === '')) {
                hasEnhancementsSet = false;
            }

            const enhancementCounts = {};
            for (const mc of mappedCards) {
                const enh = mc.card.enhancements || [];
                for (const e of enh) {
                    enhancementCounts[e] = (enhancementCounts[e] || 0) + 1;
                }
            }

            return {
                ...deck,
                cards: mappedCards,
                enhancementCounts,
                status: {
                    basicRules: hasEnhancementsSet,
                    flagged: !!deck.flagged,
                    verified: !!deck.verified,
                    usageLevel: deck.usageLevel,
                    noUnreleasedCards: true,
                    officialRole: true,
                    extendedStatus: []
                }
            };
        },
        [cardsById]
    );

    const useDecksDataLoad = (opts) => {
        const { pageIndex = 0, pageSize = 10, sorting, columnFilters } = opts || {};

        const deckFilterKey = JSON.stringify(deckFilter || {});
        const queryParams = useMemo(() => {
            const params = {
                pageSize: pageSize,
                page: pageIndex + 1,
                sort: sorting && sorting[0] ? sorting[0].id : 'lastUpdated',
                sortDir: sorting && sorting[0] && sorting[0].desc ? 'desc' : 'asc'
            };

            const filters = [];
            if (columnFilters && columnFilters.length > 0) {
                for (const f of columnFilters) {
                    filters.push({ name: f.id, value: f.value });
                }
            }
            const df = deckFilterKey ? JSON.parse(deckFilterKey) : null;
            if (df) {
                for (const [k, v] of Object.entries(df)) {
                    filters.push({ name: k, value: v });
                }
            }
            if (filters.length > 0) {
                params.filter = filters;
            }
            return params;
        }, [pageIndex, pageSize, sorting, columnFilters, deckFilterKey]);

        const standaloneQueryResult = useLoadStandaloneDecksQuery(undefined, {
            skip: !standaloneDecks,
            refetchOnMountOrArgChange: true
        });
        const regularDecksQueryResult = useLoadDecksQuery(queryParams, {
            skip: standaloneDecks,
            refetchOnMountOrArgChange: true
        });

        const queryResult = standaloneDecks ? standaloneQueryResult : regularDecksQueryResult;

        return {
            data: {
                data:
                    (standaloneDecks
                        ? queryResult.data || []
                        : queryResult.data?.decks || queryResult.data || []) ?? [],
                totalCount:
                    (standaloneDecks
                        ? queryResult.data?.length || 0
                        : queryResult.data?.numDecks || 0) ?? 0
            },
            isLoading: queryResult.isLoading,
            isError: !!queryResult.error,
            refetch: queryResult.refetch
        };
    };

    const IdCell = (info) => (
        <div className='w-8'>
            <CardBack deck={info.row.original} size={'normal'} />
        </div>
    );

    const NameCell = (info) => <span className='cursor-pointer'>{info.getValue()}</span>;

    const SetCell = (info) => (
        <img className='w-4 h-auto m-0.5' src={Constants.SetIconPaths[info.getValue()]} />
    );

    const AddedCell = (info) => moment(info.getValue()).format('YYYY-MM-DD');

    const WinRateCell = (info) => `${info.getValue()?.toFixed(2)}%`;

    const AllianceCell = (info) =>
        info.getValue() ? (
            <div className='text-center'>
                <FontAwesomeIcon icon={faCheck} />
            </div>
        ) : null;

    const ValidityCell = (info) => (
        <div className='flex justify-center'>
            <DeckStatus status={info.row.original.status} />
        </div>
    );
    const ExpansionGroupingFilter = ({ table, close }) => {
        const column = table.getColumn('expansion');
        const current = column.getFilterValue() || [];
        const selected = new Set(current.map((e) => e.value));
        const allKeys = new Set(Constants.Expansions.map((e) => e.value));

        const setSelected = (keys) => {
            if (!keys || keys.size === 0 || keys.size === allKeys.size) {
                column.setFilterValue(undefined);
            } else {
                const values = Constants.Expansions.filter((e) => keys.has(e.value));
                column.setFilterValue(values);
            }
        };

        return (
            <div className='p-2 w-64'>
                <div className='flex justify-between items-center mb-2'>
                    <span className='font-semibold'>{t('Filter by Set')}</span>
                    <div className='flex gap-1'>
                        <Button size='sm' variant='flat' onPress={() => setSelected(new Set())}>
                            {t('None')}
                        </Button>
                        <Button size='sm' variant='flat' onPress={() => setSelected(allKeys)}>
                            {t('All')}
                        </Button>
                    </div>
                </div>
                <CheckboxGroup
                    orientation='vertical'
                    value={Array.from(selected)}
                    onValueChange={(vals) => setSelected(new Set(/** @type {any[]} */ (vals)))}
                    classNames={{ wrapper: 'max-h-64 overflow-y-auto pr-2' }}
                >
                    {Constants.Expansions.map((e) => (
                        <Checkbox key={e.value} value={e.value}>
                            <div className='flex items-center gap-2'>
                                <img className='h-5 w-5' src={Constants.SetIconPaths[e.value]} />
                                <span>{e.label}</span>
                            </div>
                        </Checkbox>
                    ))}
                </CheckboxGroup>
                <div className='flex justify-end mt-2'>
                    <Button size='sm' color='primary' onPress={close}>
                        {t('Close')}
                    </Button>
                </div>
            </div>
        );
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'none',
                header: t('Id'),
                cell: IdCell,
                meta: { colWidth: '8%' },
                enableSorting: false,
                enableColumnFilter: false
            },
            {
                accessorKey: 'name',
                header: t('Name'),
                cell: NameCell,
                meta: { colWidth: '40%' }
            },
            {
                accessorKey: 'expansion',
                header: t('Set'),
                cell: SetCell,
                meta: {
                    colWidth: '10%',
                    className: 'text-center',
                    // eslint-disable-next-line react/display-name
                    groupingFilter: (table, close) => (
                        <ExpansionGroupingFilter table={table} close={close} />
                    )
                },
                enableSorting: false
            },
            {
                accessorKey: 'lastUpdated',
                header: t('Added'),
                cell: AddedCell,
                meta: { colWidth: '15%', className: 'text-center' }
            },
            {
                accessorKey: 'winRate',
                header: t('Win %'),
                cell: WinRateCell,
                meta: { colWidth: '12%', className: 'text-center max-sm:hidden' }
            },
            {
                accessorKey: 'isAlliance',
                header: t('A'),
                cell: AllianceCell,
                meta: { colWidth: '8%', className: 'text-center' }
            },
            {
                id: 'status',
                header: t('Validity'),
                cell: ValidityCell,
                meta: { colWidth: '10%', className: 'text-center' },
                enableSorting: false,
                enableColumnFilter: false
            }
        ],
        [t]
    );

    if (mode === 'accordion') {
        const total = accordionQuery.data?.numDecks || 0;
        const decks = accordionQuery.data?.decks || [];

        return (
            <div className='pt-2'>
                {accordionQuery.isLoading && (
                    <div className='text-center py-8'>
                        <Trans>Loading...</Trans>
                    </div>
                )}
                {accordionQuery.isError && (
                    <div className='text-center py-8 text-danger'>
                        <Trans>Error loading decks</Trans>
                    </div>
                )}

                {!accordionQuery.isLoading && decks.length === 0 && (
                    <div className='text-center py-8 text-default-500'>
                        <Trans>No decks found</Trans>
                    </div>
                )}

                {decks.length > 0 && (
                    <>
                        <Accordion
                            selectedKeys={
                                expandedDeckId ? new Set([expandedDeckId.toString()]) : new Set()
                            }
                            onSelectionChange={(keys) => {
                                const arr = Array.from(keys);
                                setExpandedDeckId(arr.length ? parseInt(arr[0]) : null);
                            }}
                        >
                            {decks.map((deck) => {
                                const fullDeck = enrichDeck(deck);
                                return (
                                    <AccordionItem
                                        key={fullDeck.id}
                                        aria-label={fullDeck.name}
                                        title={
                                            <div className='flex items-center gap-4 w-full'>
                                                <div className='w-16 flex-shrink-0'>
                                                    <CardBack
                                                        deck={fullDeck}
                                                        size={'normal'}
                                                        zoom={false}
                                                        showDeckName={false}
                                                    />
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <div className='font-semibold text-lg truncate'>
                                                        {fullDeck.name}
                                                    </div>
                                                    <div className='flex gap-2 items-center text-sm text-default-500 flex-wrap'>
                                                        <span>
                                                            {moment(fullDeck.lastUpdated).format(
                                                                'YYYY-MM-DD'
                                                            )}
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {t('Wins')}: {fullDeck.wins}
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {t('Losses')}: {fullDeck.losses}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{fullDeck.winRate?.toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-4 flex-shrink-0'>
                                                    {/* Enhancement summary icons moved to header */}
                                                    {fullDeck.enhancementCounts &&
                                                        Object.keys(fullDeck.enhancementCounts)
                                                            .length > 0 && (
                                                            <div className='flex gap-2'>
                                                                {[
                                                                    'amber',
                                                                    'capture',
                                                                    'draw',
                                                                    'damage',
                                                                    'discard'
                                                                ].map((type) => {
                                                                    const count =
                                                                        fullDeck.enhancementCounts[
                                                                            type
                                                                        ] || 0;
                                                                    if (!count) return null;
                                                                    const srcMap = {
                                                                        amber: AmberImage,
                                                                        capture: CaptureImage,
                                                                        draw: DrawImage,
                                                                        damage: DamageImage,
                                                                        discard: DiscardImage
                                                                    };
                                                                    return (
                                                                        <div
                                                                            key={type}
                                                                            className='flex items-center text-xs gap-1'
                                                                        >
                                                                            <img
                                                                                src={srcMap[type]}
                                                                                className='h-4 w-4'
                                                                            />
                                                                            <span>{count}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    <DeckStatus status={fullDeck.status} />
                                                    {fullDeck.isAlliance && (
                                                        <div
                                                            className='text-success'
                                                            title={t('Alliance Deck')}
                                                        >
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        }
                                        classNames={{ title: 'w-full', trigger: 'py-4' }}
                                    >
                                        <div className='pb-4'>
                                            <div className='mb-4 flex justify-end'>
                                                <Button
                                                    size='sm'
                                                    color='danger'
                                                    onPress={() => setDeleteConfirmDeck(fullDeck)}
                                                >
                                                    <Trans>Delete Deck</Trans>
                                                </Button>
                                            </div>
                                            <DeckSummary deck={fullDeck} cardsOnly />
                                        </div>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>

                        {total > pageSize && (
                            <div className='flex justify-center mt-4'>
                                <Pagination
                                    total={Math.ceil(total / pageSize)}
                                    page={page}
                                    onChange={setPage}
                                    showControls
                                />
                            </div>
                        )}

                        <Modal
                            isOpen={!!deleteConfirmDeck}
                            onOpenChange={(open) => !open && setDeleteConfirmDeck(null)}
                            placement='center'
                        >
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader>
                                            <Trans>Confirm Deletion</Trans>
                                        </ModalHeader>
                                        <ModalBody>
                                            <Trans>
                                                Are you sure you want to delete this deck?
                                            </Trans>
                                            {deleteConfirmDeck && (
                                                <div className='mt-2 font-semibold'>
                                                    {deleteConfirmDeck.name}
                                                </div>
                                            )}
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color='default' onPress={onClose}>
                                                <Trans>Cancel</Trans>
                                            </Button>
                                            <Button
                                                color='danger'
                                                onPress={async () => {
                                                    if (deleteConfirmDeck?.id) {
                                                        try {
                                                            await deleteDeck(
                                                                deleteConfirmDeck.id
                                                            ).unwrap();
                                                            setExpandedDeckId(null);
                                                            accordionQuery.refetch();
                                                        } catch (e) {
                                                            // ignore
                                                        }
                                                    }
                                                    onClose();
                                                }}
                                            >
                                                <Trans>Delete</Trans>
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                    </>
                )}
            </div>
        );
    }

    // Default table view (existing behavior)
    return (
        <div className='pt-4'>
            <ReactTable
                columns={columns}
                dataLoadFn={useDecksDataLoad}
                remote
                onRowClick={(row) => onDeckSelected && onDeckSelected(row.original)}
                selectedRows={selectedDeck ? new Set([selectedDeck.id]) : new Set([])}
                onRowSelectionChange={(rows) => {
                    const deck = rows[0]?.original;
                    if (deck) {
                        dispatch(selectDeckReducer(deck));
                    }
                }}
            />
        </div>
    );
};

DeckList.displayName = 'DeckList';
export default DeckList;
