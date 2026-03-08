import React, { useCallback, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { Input } from '@heroui/react';
import Icon from '../Icon';
import { faCheck, faFileImport, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

import CardBack from './CardBack';
import DeckSetFilter from './DeckSetFilter';
import ReactTable from '../Table/ReactTable';
import { cardsActions } from '../../redux/slices/cardsSlice';
import { useGetDecksQuery, useGetStandaloneDecksQuery } from '../../redux/api';
import { Constants } from '../../constants';

/**
 * @typedef DeckListProps
 * @property {Deck} [activeDeck] The currently selected deck
 * @property {boolean} [noFilter] Whether or not to enable filtering
 * @property {function(Deck): void} [onDeckSelected] Callback fired when a deck is selected
 * @property {boolean} [standaloneDecks] Only load standalone decks rather than the user decks
 */

/**
 * @param {DeckListProps} props
 */
const DeckList = ({
    deckFilter,
    hideActionButtons = false,
    onDeckSelected,
    onDeleteDecks,
    onImportDeck,
    onNavigateAllianceDeck,
    onSelectionChange,
    selectedRows,
    selectedDeckCount = 0,
    standaloneDecks = false,
    expansions = Constants.Expansions
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const normalizeFilterEntry = useCallback(([key, value]) => {
        if (key === 'expansion') {
            return {
                name: key,
                value: Array.isArray(value)
                    ? value.map((expansion) =>
                          typeof expansion === 'object' ? expansion.value : expansion
                      )
                    : value
            };
        }

        return { name: key, value };
    }, []);
    const initialExpansions = deckFilter?.expansion || expansions;
    const [selectedExpansions, setSelectedExpansions] = useState(initialExpansions);
    const [activeFilters, setActiveFilters] = useState(
        deckFilter ? Object.entries(deckFilter).map(normalizeFilterEntry) : []
    );
    const nameFilterValue = useRef('');

    const { decks, selectedDeck } = useSelector((state) => ({
        decks: standaloneDecks ? state.cards.standaloneDecks : state.cards.decks,
        selectedDeck: standaloneDecks ? null : state.cards.selectedDeck
    }));
    const { authToken, refreshToken } = useSelector((state) => ({
        authToken: state.auth.token,
        refreshToken: state.auth.refreshToken
    }));
    const hasAuth = Boolean(authToken || refreshToken);
    const shouldUseRemoteDecks = !standaloneDecks && hasAuth;
    const useDecksQuery = (queryArgs) =>
        useGetDecksQuery(queryArgs, {
            skip: !shouldUseRemoteDecks
        });

    const buildFilters = useCallback(
        (nameValue, expansionValues) => {
            let filters = [];
            if (nameValue) {
                filters.push({ name: 'name', value: nameValue });
            }

            if (expansionValues) {
                filters.push({
                    name: 'expansion',
                    value: expansionValues.map((expansion) => expansion.value)
                });
            }

            if (deckFilter) {
                filters = filters.concat(Object.entries(deckFilter).map(normalizeFilterEntry));
            }

            return filters;
        },
        [deckFilter, normalizeFilterEntry]
    );

    const updateFilters = useMemo(
        () =>
            debounce((nextName, nextExpansions) => {
                setActiveFilters(buildFilters(nextName, nextExpansions));
            }, 500),
        [buildFilters]
    );

    useGetStandaloneDecksQuery(undefined, { skip: !standaloneDecks });

    const onRowClick = (deck) => {
        dispatch(cardsActions.selectDeck(deck));
        if (onDeckSelected) {
            onDeckSelected(deck);
        }
    };

    const onSetsChange = useCallback(
        (nextValues) => {
            setSelectedExpansions(nextValues);
            updateFilters(nameFilterValue.current, nextValues);
        },
        [updateFilters]
    );

    const columns = useMemo(() => {
        const baseColumns = [
            {
                accessorKey: 'id',
                header: t('Id'),
                cell: ({ row }) => (
                    <div className='h-10 w-7 px-0 [&_canvas]:!h-full [&_canvas]:!w-full [&_canvas]:!max-h-full [&_canvas]:!max-w-full'>
                        <CardBack
                            deck={row.original}
                            imageClassName='!h-full !w-full !max-h-full !max-w-full'
                        />
                    </div>
                ),
                enableColumnFilter: false,
                meta: { className: 'w-11', colWidth: '44px' }
            },
            {
                accessorKey: 'name',
                header: t('Name'),
                cell: ({ row }) => (
                    <span
                        className={`block max-w-full truncate text-[0.8rem] ${
                            selectedDeck && row.original.id === selectedDeck.id
                                ? 'text-foreground font-semibold'
                                : ''
                        } ${
                            row.original.status?.basicRules === false
                                ? 'text-[color:color-mix(in_oklab,var(--brand)_78%,black)] dark:text-[color:var(--brand-strong)]'
                                : ''
                        }`}
                        title={row.original.name}
                    >
                        {row.original.name}
                    </span>
                ),
                enableColumnFilter: false,
                meta: { className: 'min-w-0', colWidth: '44%' }
            },
            {
                accessorKey: 'expansion',
                header: t('Set'),
                cell: ({ row }) => (
                    <div className='text-center'>
                        <img
                            className='m-0.5 inline-block max-w-4'
                            src={Constants.SetIconPaths[row.original.expansion]}
                        />
                    </div>
                ),
                enableColumnFilter: false,
                meta: { className: 'text-center', colWidth: '64px' }
            },
            {
                accessorKey: 'lastUpdated',
                header: t('Added'),
                cell: ({ row }) => (
                    <span className='text-center text-[0.7rem]'>
                        {moment(row.original.lastUpdated).format('YYYY-MM-DD')}
                    </span>
                ),
                enableColumnFilter: false,
                meta: { className: 'text-center whitespace-nowrap', colWidth: '110px' }
            }
        ];

        if (!standaloneDecks) {
            baseColumns.push({
                accessorKey: 'winRate',
                header: t('Win %'),
                cell: ({ row }) => (
                    <span className='text-center text-[0.8rem]'>
                        {row.original.winRate?.toFixed(2)}%
                    </span>
                ),
                enableColumnFilter: false,
                meta: { className: 'text-center whitespace-nowrap', colWidth: '78px' }
            });
        }

        baseColumns.push({
            accessorKey: 'isAlliance',
            header: t('A'),
            cell: ({ row }) => (
                <div className='text-center text-[0.8rem]'>
                    {row.original.isAlliance ? <Icon icon={faCheck} /> : null}
                </div>
            ),
            enableColumnFilter: false,
            meta: { className: 'text-center', colWidth: '40px' }
        });

        return baseColumns;
    }, [selectedDeck, standaloneDecks, t]);

    const filteredDecks = useMemo(() => {
        const localDecks = Array.isArray(decks) ? decks : [];

        if (shouldUseRemoteDecks) {
            return localDecks;
        }

        const filters = activeFilters || [];
        if (filters.length === 0) {
            return localDecks;
        }

        return localDecks.filter((deck) =>
            filters.every((filter) => {
                if (filter.name === 'expansion') {
                    return (
                        Array.isArray(filter.value) &&
                        filter.value.map(String).includes(String(deck.expansion))
                    );
                }

                if (filter.name === 'isAlliance') {
                    return Boolean(deck.isAlliance) === Boolean(filter.value);
                }

                if (filter.name === 'name') {
                    const deckName = (deck.name || '').toLowerCase();
                    const expected = String(filter.value || '').toLowerCase();
                    return deckName.includes(expected);
                }

                return true;
            })
        );
    }, [activeFilters, decks, shouldUseRemoteDecks]);

    const tableButtons = useMemo(() => {
        if (standaloneDecks || hideActionButtons) {
            return [];
        }

        return [
            {
                icon: <Icon icon={faFileImport} />,
                label: t('Import Deck'),
                onPress: onImportDeck,
                variant: 'primary'
            },
            {
                icon: <Icon icon={faPlus} />,
                label: t('Build Alliance Deck'),
                onPress: onNavigateAllianceDeck,
                variant: 'tertiary'
            },
            {
                icon: <Icon icon={faTrash} />,
                label:
                    selectedDeckCount > 0 ? `${t('Delete')} (${selectedDeckCount})` : t('Delete'),
                disabled: selectedDeckCount === 0,
                onPress: onDeleteDecks,
                variant: 'danger'
            }
        ];
    }, [
        onDeleteDecks,
        onImportDeck,
        onNavigateAllianceDeck,
        selectedDeckCount,
        hideActionButtons,
        standaloneDecks,
        t
    ]);

    return (
        <div className='flex h-full min-h-0 flex-col pt-4'>
            {!standaloneDecks ? (
                <div className='mb-3 grid gap-3 lg:grid-cols-2'>
                    <div>
                        <label className='mb-1 block text-sm text-foreground'>{t('Name')}</label>
                        <Input
                            className='w-full'
                            name='name'
                            placeholder={t('Filter by name')}
                            variant='tertiary'
                            onChange={(event) => {
                                nameFilterValue.current = event.target.value.toLowerCase();
                                updateFilters(nameFilterValue.current, selectedExpansions);
                            }}
                        />
                    </div>
                    <DeckSetFilter
                        expansions={expansions}
                        label={t('Expansion')}
                        selectedExpansions={selectedExpansions}
                        t={t}
                        onChange={onSetsChange}
                    />
                </div>
            ) : null}

            <div className='min-h-0 flex-1'>
                <ReactTable
                    buttons={tableButtons}
                    fillHeight
                    columns={columns}
                    data={filteredDecks}
                    dataLoadFn={useDecksQuery}
                    dataLoadArg={
                        shouldUseRemoteDecks
                            ? {
                                  filter: activeFilters
                              }
                            : undefined
                    }
                    dataProperty='decks'
                    isStriped
                    maxVisibleRows={15}
                    pageSizeOptions={[15, 25, 50]}
                    remote={shouldUseRemoteDecks}
                    defaultSort={[{ id: 'lastUpdated', desc: true }]}
                    selectedRows={selectedRows}
                    startPageSize={15}
                    tableClassName='table-fixed'
                    getRowClassName={(row) => {
                        const isSelected = selectedDeck && row.original.id === selectedDeck.id;
                        const isInvalid = row.original.status?.basicRules === false;
                        const baseRowClass =
                            'border-[color:var(--table-border)] hover:bg-[var(--table-row-hover)] dark:border-white/10 dark:hover:bg-white/5';
                        const selectedRowClass = isSelected
                            ? 'bg-[var(--table-selected-bg)] ring-1 ring-inset ring-[color:var(--table-selected-ring)] [box-shadow:inset_4px_0_0_0_var(--brand)] hover:!bg-[var(--table-selected-bg-hover)]'
                            : '';
                        const invalidRowClass = isInvalid
                            ? 'bg-[color:color-mix(in_oklab,var(--table-row-bg)_88%,var(--brand))] hover:!bg-[color:color-mix(in_oklab,var(--table-row-hover)_82%,var(--brand))]'
                            : '';

                        return `${baseRowClass} ${selectedRowClass} ${invalidRowClass}`.trim();
                    }}
                    onRowSelectionChange={(rows) =>
                        onSelectionChange
                            ? onSelectionChange(rows.map((row) => row.original))
                            : null
                    }
                    onRowClick={(row) => onRowClick(row.original)}
                />
            </div>
        </div>
    );
};

DeckList.displayName = 'DeckList';
export default DeckList;
