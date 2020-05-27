import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BootstrapTable from 'react-bootstrap-table-next';
import { Col, Form } from 'react-bootstrap';
import { Formik, useFormikContext } from 'formik';
import moment from 'moment';

import { buildArchon } from '../../archonMaker';

const SubmitOnChange = () => {
    // Grab values and submitForm from context
    const { values, submitForm } = useFormikContext();
    useEffect(() => {
        submitForm();
    }, [values, submitForm]);

    return null;
};

/**
 * @typedef DeckListProps
 * @property {Deck} activeDeck
 * @property {string} [className]
 * @property {Deck[]} decks
 * @property {boolean} [noFilter]
 * @property {function(void): void} onSelectDeck
 */

/**
 * @param {DeckListProps} props
 */
const DeckList = ({ activeDeck, className, decks, noFilter, onSelectDeck }) => {
    const { t, i18n } = useTranslation();

    const getStatusName = (status) => {
        if (status.usageLevel === 1 && !status.verified) {
            return t('Used');
        } else if (status.usageLevel === 2 && !status.verified) {
            return t('Popular');
        } else if (status.usageLevel === 3 && !status.verified) {
            return t('Notorious');
        } else if (!status.officialRole || !status.noUnreleasedCards) {
            return t('Casual');
        }

        return t('Valid');
    };

    const initialValues = {
        searchFilter: '',
        expansionFilter: '',
        sortOrder: 'datedesc',
        pageSize: 10,
        currentPage: 0
    };

    const columns = [
        {
            dataField: 'none',
            text: t('Id'),
            sort: false,
            formatExtraData: 
            formatter: (_, row) => {
                return buildArchon(row, i18n.language);
            }
        },
        {
            dataField: 'name',
            text: t('Name'),
            sort: true
        },
        {
            dataField: 'status',
            text: t('Status'),
            sort: true,
            formatter: (cell) => getStatusName(cell)
        },
        {
            dataField: 'lastUpdated',
            text: t('Date Added'),
            sort: true,
            formatter: (cell) => moment(cell).format('Do MMM YYYY')
        }
    ];

    const handleSubmit = (event) => {
        console.info(event);
    };

    return (
        <div className={className}>
            {!noFilter && (
                <Formik onSubmit={handleSubmit} initialValues={initialValues}>
                    {(formProps) => (
                        <Form
                            onSubmit={(event) => {
                                event.preventDefault();
                                formProps.handleSubmit(event);
                            }}
                        >
                            <Form.Row>
                                <Form.Group as={Col} md='8' controlId='formGridFilter'>
                                    <Form.Label>{t('Filter')}</Form.Label>
                                    <Form.Control
                                        name='filter'
                                        type='text'
                                        placeholder={t('Search...')}
                                        value={formProps.values.searchFilter}
                                        onChange={formProps.handleChange}
                                        onBlur={formProps.handleBlur}
                                        isInvalid={
                                            formProps.touched.searchFilter &&
                                            !!formProps.errors.searchFilter
                                        }
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formProps.errors.searchFilter}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md='4' controlId='formGridPageSize'>
                                    <Form.Label>{t('Show')}</Form.Label>
                                    <Form.Control
                                        name='pageSize'
                                        as='select'
                                        value={formProps.values.pageSize}
                                        onChange={formProps.handleChange}
                                        onBlur={formProps.handleBlur}
                                        isInvalid={
                                            formProps.touched.pageSize &&
                                            !!formProps.errors.pageSize
                                        }
                                    >
                                        <option>10</option>
                                        <option>25</option>
                                        <option>50</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type='invalid'>
                                        {formProps.errors.pageSize}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} md='12' controlId='formGridExpansion'>
                                    <Form.Label>{t('Filter by expansion')}</Form.Label>
                                    <Form.Control
                                        name='expansion'
                                        as='select'
                                        value={formProps.values.expansion}
                                        onChange={formProps.handleChange}
                                        onBlur={formProps.handleBlur}
                                        isInvalid={
                                            formProps.touched.expansion &&
                                            !!formProps.errors.expansion
                                        }
                                    >
                                        <option />
                                        <option>{t('Worlds Collide')}</option>
                                        <option>{t('Age of Ascension')}</option>
                                        <option>{t('Call of the Archons')}</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type='invalid'>
                                        {formProps.errors.expansion}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Col md={12}>
                                {/* <Trans>Sort by</Trans>:
                                    <RadioGroup
                                        buttons={sortButtons}
                                        onValueSelected={this.onSortChanged}
                                        defaultValue={this.state.sortOrder}
                                    /> */}
                            </Col>
                            <nav className='col-md-12' aria-label={t('Page navigation')}>
                                <ul className='pagination'>
                                    <li>
                                        {/* <a
                                            href='#'
                                            aria-label={t('Previous')}
                                            onClick={this.onPageChanged.bind(this, 0)}
                                        >
                                            <span aria-hidden='true'>&laquo;</span>
                                        </a> */}
                                    </li>
                                    {/* {pager} */}
                                    {/* <li>
                                            <a
                                                href='#'
                                                aria-label={t('Next')}
                                                onClick={this.onPageChanged.bind(
                                                    this,
                                                    pages.length - 1
                                                )}
                                            >
                                                <span aria-hidden='true'>&raquo;</span>
                                            </a>
                                        </li> */}
                                </ul>
                            </nav>

                            <SubmitOnChange />
                        </Form>
                    )}
                </Formik>
            )}
            <Col md={12}>
                <BootstrapTable
                    bootstrap4
                    striped
                    keyField='id'
                    data={decks}
                    columns={columns}
                    // pagination={paginationFactory()}
                    defaultSorted={[{ dataField: 'datePublished', order: 'desc' }]}
                />
            </Col>
        </div>
    );
};

// class DeckList extends React.Component {
//     constructor(props) {
//         super(props);

//         this.changeFilter = _.debounce((filter) => this.onChangeFilter(filter), 200);
//         this.onChangeExpansionFilter = this.onChangeExpansionFilter.bind(this);
//         this.filterDeck = this.filterDeck.bind(this);
//         this.onSortChanged = this.onSortChanged.bind(this);
//         this.onPageSizeChanged = this.onPageSizeChanged.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//     }

//     filterDeck(deck) {
//         let t = this.props.t;
//         const passedSearchFilter =
//             this.state.searchFilter === '' ||
//             deck.name.toLowerCase().includes(this.state.searchFilter);
//         const passedExpansionFilter =
//             this.state.expansionFilter === '' ||
//             (this.state.expansionFilter === t('Worlds Collide') && deck.expansion === 452) ||
//             (this.state.expansionFilter === t('Age of Ascension') && deck.expansion === 435) ||
//             (this.state.expansionFilter === t('Call of the Archons') && deck.expansion === 341);

//         return passedSearchFilter && passedExpansionFilter;
//     }

//     handleSubmit(event) {
//         console.info(event);
//     }

//     onChangeExpansionFilter(event) {
//         this.setState({
//             currentPage: 0,
//             expansionFilter: event.target.value
//         });
//     }

//     onSortChanged(value) {
//         this.setState({ sortOrder: value });
//     }

//     onPageSizeChanged(event) {
//         this.setState({
//             currentPage: 0,
//             pageSize: event.target.value
//         });
//     }

//     onPageChanged(page) {
//         this.setState({ currentPage: page });
//     }

//     render() {
//         let deckRows = [];
//         let numDecksNotFiltered = 0;

//         if (!decks || decks.length === 0) {
//             deckRows = t('You have no decks, try adding one');
//         } else {
//             let index = 0;
//             let sortedDecks = decks;

//             // switch (this.state.sortOrder) {
//             //     case 'dateasc':
//             //         sortedDecks = _.sortBy(sortedDecks, 'lastUpdated');
//             //         break;
//             //     case 'nameasc':
//             //         sortedDecks = _.sortBy(sortedDecks, 'name');
//             //         break;
//             //     case 'namedesc':
//             //         sortedDecks = _.sortBy(sortedDecks, 'name').reverse();
//             //         break;
//             //     case 'datedesc':
//             //     default:
//             //         break;
//             // }

//             //       sortedDecks = sortedDecks.filter(this.filterDeck);
//             // numDecksNotFiltered = sortedDecks.length;

//             // sortedDecks = sortedDecks.slice(
//             //     this.state.currentPage * this.state.pageSize,
//             //     this.state.currentPage * this.state.pageSize + this.state.pageSize
//             // );

//             for (let deck of sortedDecks) {
//                 deckRows.push(
//                     <DeckRow
//                         active={activeDeck && activeDeck.id === deck.id}
//                         deck={deck}
//                         key={index++}
//                         onSelect={onSelectDeck}
//                     />
//                 );
//             }
//         }

//         let sortButtons = [
//             { value: 'datedesc', label: t('Date Desc') },
//             { value: 'dateasc', label: t('Date Asc') },
//             { value: 'nameasc', label: t('Name Asc') },
//             { value: 'namedesc', label: t('Name Desc') }
//         ];

//         // let pager = [];
//         // let pages = _.range(0, Math.ceil(numDecksNotFiltered / this.state.pageSize));
//         // for (let page of pages) {
//         //     pager.push(
//         //         <li key={page}>
//         //             <a
//         //                 href='#'
//         //                 className={page === this.state.currentPage ? 'active' : null}
//         //                 onClick={this.onPageChanged.bind(this, page)}
//         //             >
//         //                 {page + 1}
//         //             </a>
//         //         </li>
//         //     );
//         // }
//     }
// }

DeckList.displayName = 'DeckList';
export default DeckList;
