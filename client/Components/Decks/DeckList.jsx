import React, { useMemo } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Button from '../HeroUI/Button';
import { Checkbox, CheckboxGroup } from '@heroui/react';
import ReactTable from '../Table/ReactTable';
import CardBack from './CardBack.jsx';
import DeckStatus from './DeckStatus';
import { Constants } from '../../constants';
import { useLoadDecksQuery, useLoadStandaloneDecksQuery } from '../../redux/slices/apiSlice';
import { selectDeckReducer } from '../../redux/slices/cardsSlice';

const DeckList = ({ deckFilter, onDeckSelected, standaloneDecks = false }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    // Selection state remains in cards slice, but data comes from RTK Query
    const selectedDeck = useSelector((state) =>
        standaloneDecks ? null : state.cards.selectedDeck
    );

    const useDecksDataLoad = (opts) => {
        const { pageIndex = 0, pageSize = 10, sorting, columnFilters } = opts || {};

        // Build query params for RTK Query
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

        // Invoke appropriate query hook with params
        const standaloneQueryResult = useLoadStandaloneDecksQuery(undefined, {
            skip: !standaloneDecks,
            refetchOnMountOrArgChange: true
        });
        const regularDecksQueryResult = useLoadDecksQuery(queryParams, {
            skip: standaloneDecks,
            refetchOnMountOrArgChange: true
        });

        // Use the appropriate query result based on standaloneDecks flag
        const queryResult = standaloneDecks ? standaloneQueryResult : regularDecksQueryResult;

        // Adapt to ReactTable expected shape
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
