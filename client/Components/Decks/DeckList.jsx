import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Archon from './Archon';

import './DeckList.scss';
import { loadDecks } from '../../redux/actions';

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
 * @property {function(void): void} onSelectDeck Callback to invoke when a deck is selected
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
    const dispatch = useDispatch();

    const { decks, numDecks } = useSelector((state) => ({
        decks: state.cards.decks,
        numDecks: state.cards.numDecks
    }));

    useEffect(() => {
        dispatch(loadDecks(pagingDetails));
    }, [pagingDetails, dispatch]);

    // const getStatusName = (status) => {
    //     if (status.usageLevel === 1 && !status.verified) {
    //         return t('Used');
    //     } else if (status.usageLevel === 2 && !status.verified) {
    //         return t('Popular');
    //     } else if (status.usageLevel === 3 && !status.verified) {
    //         return t('Notorious');
    //     } else if (!status.officialRole || !status.noUnreleasedCards) {
    //         return t('Casual');
    //     }

    //     return t('Valid');
    // };

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
            filter: textFilter()
        },
        {
            dataField: 'expansion',
            headerStyle: {
                width: '10%'
            },
            align: 'center',
            sort: true,
            // eslint-disable-next-line react/display-name
            formatter: (cell) => (
                <img className='deck-expansion' src={`/img/idbacks/${cell}.png`} />
            ),
            filter: selectFilter({
                options: { 0: 'hi' },
                className: 'test-classname',
                withoutEmptyOption: true,
                style: { backgroundColor: 'pink' }
            })
        },
        {
            dataField: 'lastUpdated',
            headerStyle: {
                width: '25%'
            },
            align: 'center',
            text: t('Date Added'),
            sort: true,
            /**
             * @param {Date} cell
             */
            formatter: (cell) => moment(cell).format('Do MMM YYYY')
        }
    ];

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
                <BootstrapTable
                    bootstrap4
                    remote
                    hover
                    keyField='id'
                    data={decks}
                    columns={columns}
                    pagination={paginationFactory({
                        page: pagingDetails.page,
                        sizePerPage: pagingDetails.pageSize,
                        totalSize: numDecks
                    })}
                    filter={filterFactory()}
                    onTableChange={onTableChange}
                    defaultSorted={[{ dataField: 'datePublished', order: 'desc' }]}
                />
            </Col>
        </div>
    );
};

DeckList.displayName = 'DeckList';
export default DeckList;
