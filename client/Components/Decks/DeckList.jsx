import React, { useState } from 'react';
import { Col } from 'react-bootstrap';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useTranslation } from 'react-i18next';

import Archon from './Archon';

import './DeckList.scss';

/**
 * @typedef Deck
 * @property {string} name The name of the deck
 * @property {string[]} houses The houses in the deck
 * @property {Date} lastUpdated The date the deck was last saved
 */

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
const DeckList = ({ className, decks }) => {
    const { t } = useTranslation();
    const [zoomArchon, setZoomArchon] = useState(false);
    const [acrhonImage, setArchonImage] = useState('');

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

    const columns = [
        {
            dataField: 'none',
            text: t('Id'),
            sort: false,
            // eslint-disable-next-line react/display-name
            formatter: (_, row) => (
                <div className='deck-image'>
                    <Archon
                        deck={row}
                        onZoomToggle={(zoom) => setZoomArchon(zoom)}
                        onImageChanged={(image) => setArchonImage(image)}
                    />
                </div>
            )
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
                    striped
                    keyField='id'
                    data={decks}
                    columns={columns}
                    pagination={paginationFactory()}
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
