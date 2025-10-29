import React, { useMemo, useEffect } from 'react';
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
import './DeckList.scss';
import { Constants } from '../../constants';
import { loadDecks, loadStandaloneDecks, selectDeck } from '../../redux/actions';

/**
 * @typedef CardLanguage
 * @property {string} name
 */

/**
 * @typedef Card
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {string} house
 * @property {string} rarity
 * @property {string} number
 * @property {string} image
 * @property {number} amber
 * @property {number} [armor]
 * @property {number} power
 * @property {number} expansion
 * @property {string} packCode
 * @property {string[]} traits
 * @property {string[]} keywords
 * @property {{[key: string]: CardLanguage}} locale
 */

/**
 * @typedef DeckCard
 * @property {number} count
 * @property {string} id
 * @property {Card} card
 */

/**
 * @typedef Deck
 * @property {number} id The database id of the deck
 * @property {string} name The name of the deck
 * @property {string[]} houses The houses in the deck
 * @property {Date} lastUpdated The date the deck was last saved
 * @property {DeckCard[]} cards The cards in the deck along with how many of each card
 * @property {number} expansion The expansion number
 * @property {string} losses The number of losses this deck has had
 * @property {string} username The owner of this deck
 * @property {string} uuid The unique identifier of the deck
 * @property {number} wins The number of wins this deck has had
 * @property {number} winRate The win rate of the deck
 * @property {number} usageLevel The usage level of the deck
 */

/**
 * @typedef DeckListProps
 * @property {Deck} [activeDeck] The currently selected deck
 * @property {boolean} [noFilter] Whether or not to enable filtering
 * @property {function(Deck): void} [onDeckSelected] Callback fired when a deck is selected
 * @property {boolean} [standaloneDecks] Only load the standalong decks rather than the user decks
 */

/**
 * @typedef PagingDetails
 * @property {number} page
 * @property {number} sizePerPage
 * @property {string} sortField
 * @property {string} sortOrder
 * @property {{ [key: string]: { filterVal: string; }; }} filters
 * @property {Expansion[]} expansions
 */

/**
 * @param {DeckListProps} props
 */
const DeckList = ({ deckFilter, onDeckSelected, standaloneDecks = false }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const decks = useSelector((state) =>
        standaloneDecks ? state.cards.standaloneDecks : state.cards.decks
    );
    const numDecks = useSelector((state) => state.cards.numDecks);
    const selectedDeck = useSelector((state) =>
        standaloneDecks ? null : state.cards.selectedDeck
    );

    // Adapter hook to match ReactTable's dataLoadFn interface using existing redux actions/state
    const useDecksDataLoad = (opts) => {
        const { pageIndex = 0, pageSize = 10, sorting, columnFilters } = opts || {};

        // Ensure stable dependency tracking for deckFilter object contents
        // String key of deckFilter contents for stable deps without mutating original
        const deckFilterKey = JSON.stringify(deckFilter || {});

        const pagingDetails = useMemo(() => {
            const pd = {
                pageSize: pageSize,
                page: pageIndex + 1, // Convert 0-indexed to 1-indexed
                sort: sorting && sorting[0] ? sorting[0].id : 'lastUpdated',
                sortDir: sorting && sorting[0] && sorting[0].desc ? 'desc' : 'asc',
                // Explicit any[] to avoid TS inferring never[] under checkJS
                filter: /** @type {any[]} */ ([])
            };

            if (columnFilters && columnFilters.length > 0) {
                pd.filter = columnFilters.map((/** @type {any} */ f) => ({
                    name: f.id,
                    value: f.value
                }));
            }

            const df = deckFilterKey ? JSON.parse(deckFilterKey) : null;
            if (df) {
                for (const [k, v] of Object.entries(/** @type {any} */ (df))) {
                    pd.filter.push({ name: k, value: v });
                }
            }

            return pd;
        }, [pageIndex, pageSize, sorting, columnFilters, deckFilterKey]);

        useEffect(() => {
            if (standaloneDecks) {
                dispatch(loadStandaloneDecks());
            } else {
                dispatch(loadDecks(pagingDetails));
            }
        }, [pagingDetails]);

        const refetch = useMemo(
            () => () => {
                if (standaloneDecks) {
                    dispatch(/** @type {any} */ (loadStandaloneDecks()));
                } else {
                    dispatch(/** @type {any} */ (loadDecks(pagingDetails)));
                }
            },
            [pagingDetails]
        );

        return {
            data: { data: decks || [], totalCount: numDecks || 0 },
            isLoading: false,
            isError: false,
            refetch
        };
    };

    // Named cell renderers to satisfy react/display-name and improve DevTools labels
    const IdCell = (info) => (
        <div className='deck-image'>
            <CardBack deck={info.row.original} size={'normal'} />
        </div>
    );

    const NameCell = (info) => <span className='cursor-pointer'>{info.getValue()}</span>;

    const SetCell = (info) => (
        <img className='deck-expansion' src={Constants.SetIconPaths[info.getValue()]} />
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
                    {Constants.Expansions.map((/** @type {any} */ e) => (
                        <Checkbox key={e.value} value={e.value}>
                            <div className='flex items-center gap-2'>
                                <img
                                    className='h-5 w-5'
                                    src={/** @type {any} */ (Constants.SetIconPaths)[e.value]}
                                />
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
                    // Wrapper needed to pass table and close args correctly
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
        <div className='deck-list'>
            <ReactTable
                columns={columns}
                dataLoadFn={useDecksDataLoad}
                remote
                onRowClick={(row) => onDeckSelected && onDeckSelected(row.original)}
                selectedRows={selectedDeck ? new Set([selectedDeck.id]) : new Set([])}
                onRowSelectionChange={(rows) => {
                    const deck = rows[0]?.original;
                    if (deck) {
                        dispatch(selectDeck(deck));
                    }
                }}
            />
        </div>
    );
};

DeckList.displayName = 'DeckList';
export default DeckList;
