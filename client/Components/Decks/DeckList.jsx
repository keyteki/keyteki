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

import Archon from './Archon';

import { loadDecks, selectDeck } from '../../redux/actions';

import './DeckList.scss';

let expansions = [
    { value: '341', label: 'CotA' },
    { value: '435', label: 'AoA' },
    { value: '452', label: 'WC' },
    { value: '512', label: 'MM' }
];

/**
 * @typedef Deck
 * @property {string} name The name of the deck
 * @property {string[]} houses The houses in the deck
 * @property {Date} lastUpdated The date the deck was last saved
 */

/**
 * @typedef DeckListProps
 * @property {Deck} [activeDeck] The currently selected deck
 * @property {string} [className] The CSS class name to use
 * @property {boolean} [noFilter] Whether or not to enable filtering
 */

/**
 * @typedef PagingDetails
 * @property {number} page
 * @property {number} sizePerPage
 * @property {string} sortField
 * @property {string} sortOrder
 * @property {{ [key: string]: { filterVal: string; }; }} filters
 */

/**
 * @param {DeckListProps} props
 */
const DeckList = ({ className }) => {
    const { t } = useTranslation();
    const [zoomArchon, setZoomArchon] = useState(false);
    const [acrhonImage, setArchonImage] = useState('');
    const [pagingDetails, setPagingDetails] = useState({
        pageSize: 10,
        page: 1,
        sort: 'lastUpdated',
        sortDir: 'desc',
        filter: []
    });
    const nameFilter = useRef(null);
    const expansionFilter = useRef(null);
    const dispatch = useDispatch();

    const { decks, numDecks, selectedDeck } = useSelector((state) => ({
        decks: state.cards.decks,
        numDecks: state.cards.numDecks,
        selectedDeck: state.cards.selectedDeck
    }));

    useEffect(() => {
        dispatch(loadDecks(pagingDetails));

        $('.filter-label').parent().parent().hide();
    }, [pagingDetails, dispatch]);

    const MultiSelectFilter = () => {
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

    const selectRow = {
        mode: 'radio',
        clickToSelect: true,
        hideSelectColumn: true,
        selected: decks && selectedDeck ? [decks.find((d) => d.id === selectedDeck.id).id] : [],
        classes: 'selected-deck',
        onSelect: (deck, isSelect) => {
            if (isSelect) {
                dispatch(selectDeck(deck));
            }
        }
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
                    <Archon
                        deck={row}
                        onZoomToggle={(zoom, image) => {
                            setZoomArchon(zoom);
                            setArchonImage(image);
                        }}
                    />
                </div>
            )
        },
        {
            dataField: 'name',
            text: t('Name'),
            sort: true,
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
                width: '14%'
            },
            align: 'center',
            sort: true,
            // eslint-disable-next-line react/display-name
            formatter: (cell) => (
                <img className='deck-expansion' src={`/img/idbacks/${cell}.png`} />
            ),
            filter: multiSelectFilter({
                options: {},
                getFilter: (filter) => {
                    expansionFilter.current = filter;
                }
            })
        },
        {
            dataField: 'lastUpdated',
            headerStyle: {
                width: '20%'
            },
            style: {
                fontSize: '0.7rem'
            },
            align: 'center',
            text: t('Added'),
            sort: true,
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
            sort: true,
            /**
             * @param {number} cell
             */
            formatter: (cell) => `${cell}%`
        }
    ];

    let onNameChange = debounce((event) => {
        nameFilter.current(event.target.value);
    }, 500);

    return (
        <div className={className}>
            {zoomArchon && (
                <div className='hover-card'>
                    <div className='hover-image'>
                        <img className={'img-fluid'} src={acrhonImage} />
                    </div>
                </div>
            )}
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
                            <Form.Control as={MultiSelectFilter} />
                        </Form.Group>
                    </Form.Row>
                </Form>
            </Col>
            <Col md={12}>
                <BootstrapTable
                    bootstrap4
                    remote
                    hover
                    keyField='id'
                    data={decks}
                    columns={columns}
                    selectRow={selectRow}
                    pagination={paginationFactory({
                        page: pagingDetails.page,
                        sizePerPage: pagingDetails.pageSize,
                        totalSize: numDecks
                    })}
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
