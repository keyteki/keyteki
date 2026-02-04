import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Col, Form, Pagination, Table, Row } from 'react-bootstrap';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import debounce from 'lodash.debounce';

import CardBack from './CardBack';
import { cardsActions } from '../../redux/slices/cardsSlice';
import { useGetDecksQuery, useGetStandaloneDecksQuery } from '../../redux/api';

import './DeckList.scss';
import { Constants } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

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
const DeckList = ({
    deckFilter,
    onDeckSelected,
    standaloneDecks = false,
    expansions = Constants.Expansions
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const initialExpansions = deckFilter?.expansion || expansions;
    const [selectedExpansions, setSelectedExpansions] = useState(initialExpansions);
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
    const nameFilterValue = useRef('');

    const { decks, numDecks, selectedDeck } = useSelector((state) => ({
        decks: standaloneDecks ? state.cards.standaloneDecks : state.cards.decks,
        numDecks: state.cards.numDecks,
        selectedDeck: standaloneDecks ? null : state.cards.selectedDeck
    }));
    const { authToken, refreshToken } = useSelector((state) => ({
        authToken: state.auth.token,
        refreshToken: state.auth.refreshToken
    }));
    const hasAuth = Boolean(authToken || refreshToken);

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
                filters = filters.concat(
                    Object.entries(deckFilter).map(([k, v]) => ({
                        name: k,
                        value: k === 'expansion' ? v.map((expansion) => expansion.value) : v
                    }))
                );
            }

            return filters;
        },
        [deckFilter]
    );

    const updateFilters = useMemo(
        () =>
            debounce((nextName, nextExpansions) => {
                setPagingDetails((prev) => ({
                    ...prev,
                    page: 1,
                    filter: buildFilters(nextName, nextExpansions)
                }));
            }, 500),
        [buildFilters]
    );

    useGetDecksQuery(pagingDetails, {
        skip: standaloneDecks || !hasAuth,
        refetchOnMountOrArgChange: true
    });
    useGetStandaloneDecksQuery(undefined, { skip: !standaloneDecks });

    const onRowClick = (deck) => {
        dispatch(cardsActions.selectDeck(deck));
        if (onDeckSelected) {
            onDeckSelected(deck);
        }
    };

    const onSort = (field) => {
        if (standaloneDecks) {
            return;
        }

        setPagingDetails((prev) => {
            const nextDir = prev.sort === field && prev.sortDir === 'asc' ? 'desc' : 'asc';
            return {
                ...prev,
                sort: field,
                sortDir: nextDir
            };
        });
    };

    const totalPages = standaloneDecks
        ? 1
        : Math.max(1, Math.ceil(numDecks / pagingDetails.pageSize));
    const currentPage = standaloneDecks ? 1 : pagingDetails.page;
    const pageSizeOptions = [10, 25, 50, 100];

    const paginationItems = [];
    for (let page = 1; page <= totalPages; page += 1) {
        paginationItems.push(
            <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() =>
                    setPagingDetails((prev) => ({
                        ...prev,
                        page
                    }))
                }
            >
                {page}
            </Pagination.Item>
        );
    }

    const renderSortIcon = (field) => {
        if (standaloneDecks) {
            return null;
        }

        if (pagingDetails.sort !== field) {
            return <FontAwesomeIcon icon={faSort} className='ms-1' />;
        }

        const icon = pagingDetails.sortDir === 'asc' ? faSortUp : faSortDown;
        return <FontAwesomeIcon icon={icon} className='ms-1' />;
    };

    return (
        <div className='deck-list'>
            {!standaloneDecks && (
                <Col md={12}>
                    <Form className='deck-filter-form'>
                        <Row>
                            <Form.Group as={Col} lg='6' controlId='formGridName'>
                                <Form.Label>{t('Name')}</Form.Label>
                                <Form.Control
                                    name='name'
                                    type='text'
                                    onChange={(event) => {
                                        nameFilterValue.current = event.target.value.toLowerCase();
                                        updateFilters(nameFilterValue.current, selectedExpansions);
                                    }}
                                    placeholder={t('Filter by name')}
                                />
                            </Form.Group>
                            <Form.Group as={Col} lg='6' controlId='formGridExpansion'>
                                <Form.Label>{t('Expansion')}</Form.Label>
                                <Select
                                    className='deck-select'
                                    classNamePrefix='deck-select'
                                    isMulti
                                    options={expansions}
                                    value={selectedExpansions || []}
                                    onChange={(values) => {
                                        const nextValues = values || [];
                                        setSelectedExpansions(nextValues);
                                        updateFilters(nameFilterValue.current, nextValues);
                                    }}
                                />
                            </Form.Group>
                        </Row>
                    </Form>
                </Col>
            )}
            <Col md={12}>
                <Table bordered hover size='sm' responsive className='deck-table'>
                    <thead>
                        <tr>
                            <th style={{ width: '12%' }}>{t('Id')}</th>
                            <th
                                role={!standaloneDecks ? 'button' : undefined}
                                onClick={() => onSort('name')}
                            >
                                {t('Name')}
                                {renderSortIcon('name')}
                            </th>
                            <th
                                style={{ width: '13%' }}
                                className='text-center'
                                role={!standaloneDecks ? 'button' : undefined}
                                onClick={() => onSort('expansion')}
                            >
                                {t('Set')}
                                {renderSortIcon('expansion')}
                            </th>
                            <th
                                style={{ width: '18%' }}
                                className='text-center'
                                role={!standaloneDecks ? 'button' : undefined}
                                onClick={() => onSort('lastUpdated')}
                            >
                                {t('Added')}
                                {renderSortIcon('lastUpdated')}
                            </th>
                            {!standaloneDecks && (
                                <th
                                    style={{ width: '18%' }}
                                    className='text-center'
                                    role='button'
                                    onClick={() => onSort('winRate')}
                                >
                                    {t('Win %')}
                                    {renderSortIcon('winRate')}
                                </th>
                            )}
                            <th
                                style={{ width: '11%' }}
                                className='text-center'
                                role={!standaloneDecks ? 'button' : undefined}
                                onClick={() => onSort('isAlliance')}
                            >
                                {t('A')}
                                {renderSortIcon('isAlliance')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {decks?.map((deck) => {
                            const isSelected = selectedDeck && deck.id === selectedDeck.id;
                            const rowClass = `${!deck.status?.basicRules ? 'invalid' : ''} ${
                                isSelected ? 'selected-deck' : ''
                            }`;

                            return (
                                <tr
                                    key={deck.id}
                                    className={rowClass.trim()}
                                    onClick={() => onRowClick(deck)}
                                >
                                    <td>
                                        <div className='deck-image'>
                                            <CardBack deck={deck} size={'normal'} />
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.8rem' }}>{deck.name}</td>
                                    <td className='text-center'>
                                        <img
                                            className='deck-expansion'
                                            src={Constants.SetIconPaths[deck.expansion]}
                                        />
                                    </td>
                                    <td className='text-center' style={{ fontSize: '0.7rem' }}>
                                        {moment(deck.lastUpdated).format('YYYY-MM-DD')}
                                    </td>
                                    {!standaloneDecks && (
                                        <td className='text-center' style={{ fontSize: '0.8rem' }}>
                                            {deck.winRate?.toFixed(2)}%
                                        </td>
                                    )}
                                    <td className='text-center' style={{ fontSize: '0.8rem' }}>
                                        {deck.isAlliance ? (
                                            <FontAwesomeIcon icon={faCheck} />
                                        ) : null}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                {!standaloneDecks && (
                    <Row className='deck-pagination align-items-center'>
                        <Col xs='12' md='4' className='mb-2 mb-md-0'>
                            <Form.Select
                                size='sm'
                                className='deck-page-size'
                                value={pagingDetails.pageSize}
                                onChange={(event) => {
                                    const pageSize = parseInt(event.target.value, 10);
                                    setPagingDetails((prev) => ({
                                        ...prev,
                                        page: 1,
                                        pageSize
                                    }));
                                }}
                            >
                                {pageSizeOptions.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col xs='12' md='8'>
                            {totalPages > 1 && (
                                <Pagination className='justify-content-center justify-content-md-end mb-0'>
                                    <Pagination.Prev
                                        disabled={currentPage <= 1}
                                        onClick={() =>
                                            setPagingDetails((prev) => ({
                                                ...prev,
                                                page: Math.max(1, prev.page - 1)
                                            }))
                                        }
                                    />
                                    {paginationItems}
                                    <Pagination.Next
                                        disabled={currentPage >= totalPages}
                                        onClick={() =>
                                            setPagingDetails((prev) => ({
                                                ...prev,
                                                page: Math.min(totalPages, prev.page + 1)
                                            }))
                                        }
                                    />
                                </Pagination>
                            )}
                        </Col>
                    </Row>
                )}
            </Col>
        </div>
    );
};

DeckList.displayName = 'DeckList';
export default DeckList;
