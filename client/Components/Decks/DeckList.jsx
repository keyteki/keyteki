import React, { useState, useEffect, useRef } from 'react';
import { Col, Form } from 'react-bootstrap';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, multiSelectFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import debounce from 'lodash.debounce';
import $ from 'jquery';

import CardBack from './CardBack';
import { loadDecks, selectDeck, loadStandaloneDecks, loadTags } from '../../redux/actions';

import './DeckList.scss';
import { Constants } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

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

// Extract components outside to fix React Hot Loader issues
const MultiSelectFilter = ({ expansions, pagingDetails, expansionFilter }) => {
    return (
        <Select
            isMulti
            options={expansions}
            defaultValue={expansions}
            value={pagingDetails.filter.find((f) => f.name === 'expansion')?.value}
            onChange={(values) => expansionFilter.current(values.map((v) => v))}
        />
    );
};

const TagSelectFilter = ({ tags, pagingDetails, tagFilter, t }) => {
    const tagOptions = tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
        color: tag.color
    }));

    return (
        <Select
            isMulti
            options={tagOptions}
            placeholder={t('Filter by tags')}
            value={pagingDetails.filter.find((f) => f.name === 'tags')?.value || []}
            onChange={(values) => tagFilter.current(values || [])}
            formatOptionLabel={(option) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: option.color,
                            marginRight: '8px'
                        }}
                    />
                    {option.label}
                </div>
            )}
        />
    );
};

/**
 * @param {DeckListProps} props
 */
const DeckList = ({
    deckFilter,
    onDeckSelected,
    standaloneDecks = false,
    expansions = Constants.Expansions
}) => {
    const { t } = useTranslation();
    const [pagingDetails, setPagingDetails] = useState({
        pageSize: 10,
        page: 1,
        sort: 'lastUpdated',
        sortDir: 'desc',
        filter: deckFilter
            ? Object.entries(deckFilter).map(([k, v]) => {
                  return { name: k, value: v };
              })
            : []
    });
    const nameFilter = useRef(null);
    const expansionFilter = useRef(null);
    const tagFilter = useRef(null);
    const dispatch = useDispatch();

    const { decks, numDecks, selectedDeck, tags } = useSelector((state) => ({
        decks: standaloneDecks ? state.cards.standaloneDecks : state.cards.decks,
        numDecks: state.cards.numDecks,
        selectedDeck: standaloneDecks ? null : state.cards.selectedDeck,
        tags: state.tags?.tags || []
    }));

    useEffect(() => {
        if (standaloneDecks) {
            dispatch(loadStandaloneDecks());
        } else {
            dispatch(loadDecks(pagingDetails));
            dispatch(loadTags()); // Load tags for filtering
        }

        $('.filter-label').parent().parent().hide();
    }, [pagingDetails, dispatch, standaloneDecks]);

    const selectRow = {
        mode: 'radio',
        clickToSelect: true,
        hideSelectColumn: true,
        selected: decks && selectedDeck ? [decks.find((d) => d.id === selectedDeck.id)?.id] : [],
        classes: 'selected-deck',
        onSelect: (deck, isSelect) => {
            if (isSelect) {
                dispatch(selectDeck(deck));
            }
        }
    };

    const rowEvents = {
        onClick: (event, deck) => {
            onDeckSelected && onDeckSelected(deck);
        }
    };

    const rowClasses = (row) => {
        if (!row.status.basicRules) {
            return 'invalid';
        }

        return '';
    };

    /**
     * @param {any} type
     * @param {PagingDetails} data
     */
    const onTableChange = (type, data) => {
        let newPageData = Object.assign({}, pagingDetails);
        switch (type) {
            case 'pagination':
                if (
                    (pagingDetails.page !== data.page && data.page !== 0) ||
                    (pagingDetails.pageSize !== data.sizePerPage && data.sizePerPage !== 0)
                ) {
                    newPageData.page = data.page || pagingDetails.page;
                    newPageData.pageSize = data.sizePerPage;
                }

                break;
            case 'sort':
                newPageData.sort = data.sortField;
                newPageData.sortDir = data.sortOrder;

                break;
            case 'filter':
                newPageData.filter = Object.keys(data.filters).map((k) => ({
                    name: k,
                    value: data.filters[k].filterVal
                }));

                //filter comming from elsewhere than the table change
                if (deckFilter) {
                    newPageData.filter.push({ name: 'isAlliance', value: deckFilter.isAlliance });
                    newPageData.filter.push({ name: 'expansion', value: deckFilter.expansion });
                }

                break;
        }

        setPagingDetails(newPageData);
    };

    const columns = [
        {
            dataField: 'none',
            headerStyle: {
                width: '12%'
            },
            text: t('Id'),
            sort: false,
            // eslint-disable-next-line react/display-name
            formatter: (_, row) => (
                <div className='deck-image'>
                    <CardBack deck={row} size={'normal'} />
                </div>
            )
        },
        {
            dataField: 'name',
            text: t('Name'),
            sort: !standaloneDecks,
            style: {
                fontSize: '0.8rem'
            },
            filter: textFilter({
                getFilter: (filter) => {
                    nameFilter.current = filter;
                }
            })
        },
        {
            dataField: 'expansion',
            text: t('Set'),
            headerStyle: {
                width: '13%'
            },
            align: 'center',
            sort: !standaloneDecks,
            // eslint-disable-next-line react/display-name
            formatter: (cell) => (
                <img className='deck-expansion' src={Constants.SetIconPaths[cell]} />
            ),
            filter: multiSelectFilter({
                options: {},
                getFilter: (filter) => {
                    expansionFilter.current = filter;
                }
            })
        },
        {
            dataField: 'tags',
            text: t('Tags'),
            headerStyle: {
                display: 'none'
            },
            style: {
                display: 'none'
            },
            sort: false,
            // eslint-disable-next-line react/display-name
            formatter: (tags) => {
                if (!tags || !Array.isArray(tags)) return '';
                return tags.map((tag) => tag.name).join(', ');
            },
            filter: multiSelectFilter({
                options: {},
                getFilter: (filter) => {
                    tagFilter.current = filter;
                }
            })
        },
        {
            dataField: 'lastUpdated',
            headerStyle: {
                width: '18%'
            },
            style: {
                fontSize: '0.7rem'
            },
            align: 'center',
            text: t('Added'),
            sort: !standaloneDecks,
            /**
             * @param {Date} cell
             */
            formatter: (cell) => moment(cell).format('YYYY-MM-DD')
        },
        {
            dataField: 'winRate',
            align: 'center',
            text: t('Win %'),
            headerStyle: {
                width: '18%'
            },
            style: {
                fontSize: '0.8rem'
            },
            sort: !standaloneDecks,
            hidden: standaloneDecks,
            /**
             * @param {number} cell
             */
            formatter: (cell) => `${cell?.toFixed(2)}%`
        },
        {
            dataField: 'isAlliance',
            align: 'center',
            text: t('A'),
            headerStyle: {
                width: '11%'
            },
            style: {
                fontSize: '0.8rem'
            },
            sort: true,
            // eslint-disable-next-line react/display-name
            formatter: (_, row) =>
                row.isAlliance ? (
                    <div>
                        <FontAwesomeIcon icon={faCheck} />
                    </div>
                ) : null
        }
    ];

    let onNameChange = debounce((event) => {
        nameFilter.current(event.target.value.toLowerCase());
    }, 500);

    return (
        <div className='deck-list'>
            {!standaloneDecks && (
                <Col md={12}>
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col} lg='6' controlId='formGridName'>
                                <Form.Label>{t('Name')}</Form.Label>
                                <Form.Control
                                    name='name'
                                    type='text'
                                    onChange={(event) => {
                                        event.persist();
                                        onNameChange(event);
                                    }}
                                    placeholder={t('Filter by name')}
                                />
                            </Form.Group>
                            <Form.Group as={Col} lg='6' controlId='formGridExpansion'>
                                <Form.Label>{t('Expansion')}</Form.Label>
                                <MultiSelectFilter
                                    expansions={expansions}
                                    pagingDetails={pagingDetails}
                                    expansionFilter={expansionFilter}
                                    t={t}
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} lg='12' controlId='formGridTags'>
                                <Form.Label>{t('Tags')}</Form.Label>
                                <TagSelectFilter
                                    tags={tags}
                                    pagingDetails={pagingDetails}
                                    tagFilter={tagFilter}
                                    t={t}
                                />
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Col>
            )}
            <Col md={12}>
                <BootstrapTable
                    bootstrap4
                    remote
                    hover
                    keyField='id'
                    data={decks}
                    columns={columns}
                    selectRow={selectRow}
                    rowEvents={rowEvents}
                    rowClasses={rowClasses}
                    pagination={
                        standaloneDecks
                            ? null
                            : paginationFactory({
                                  page: pagingDetails.page,
                                  sizePerPage: pagingDetails.pageSize,
                                  totalSize: parseInt(numDecks) || 0
                              })
                    }
                    filter={filterFactory()}
                    filterPosition='top'
                    onTableChange={onTableChange}
                    defaultSorted={[{ dataField: 'datePublished', order: 'desc' }]}
                />
            </Col>
        </div>
    );
};

DeckList.displayName = 'DeckList';
export default DeckList;
