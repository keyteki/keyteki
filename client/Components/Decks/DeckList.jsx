import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { withTranslation, Trans } from 'react-i18next';

import DeckRow from './DeckRow';
import RadioGroup from '../Form/RadioGroup';

class DeckList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchFilter: undefined,
            sortOrder: 'datedesc',
            pageSize: 10,
            currentPage: 0
        };

        this.changeFilter = _.debounce(filter => this.onChangeFilter(filter), 200);
        this.filterDeck = this.filterDeck.bind(this);
        this.onSortChanged = this.onSortChanged.bind(this);
        this.onPageSizeChanged = this.onPageSizeChanged.bind(this);
    }

    filterDeck(deck) {
        if(this.state.searchFilter && !deck.name.toLowerCase().includes(this.state.searchFilter)) {
            return false;
        }

        return true;
    }

    onChangeFilter(filter) {
        this.setState({ searchFilter: filter.toLowerCase() });
    }

    onSortChanged(value) {
        this.setState({ sortOrder: value });
    }

    onPageSizeChanged(event) {
        this.setState({ pageSize: event.target.value });
    }

    onPageChanged(page) {
        this.setState({ currentPage: page });
    }

    render() {
        let { activeDeck, className, decks, onSelectDeck, t } = this.props;

        let deckRows = [];

        if(!decks || decks.lenth === 0) {
            deckRows = t('You have no decks, try adding one');
        } else {
            let index = 0;
            let sortedDecks = decks.slice(0);

            switch(this.state.sortOrder) {
                case 'dateasc':
                    sortedDecks = _.sortBy(sortedDecks, 'lastUpdated');
                    break;
                case 'nameasc':
                    sortedDecks = _.sortBy(sortedDecks, 'name');
                    break;
                case 'namedesc':
                    sortedDecks = _.sortBy(sortedDecks, 'name').reverse();
                    break;
                case 'datedesc':
                default:
                    break;
            }

            for(let deck of sortedDecks.slice(this.state.currentPage * this.state.pageSize, (this.state.currentPage * this.state.pageSize) + this.state.pageSize)) {
                if(this.filterDeck(deck)) {
                    deckRows.push(<DeckRow active={ activeDeck && activeDeck._id === deck._id } deck={ deck } key={ index++ } onSelect={ onSelectDeck } />);
                }
            }
        }

        let sortButtons = [
            { value: 'datedesc', label: t('Date Desc') },
            { value: 'dateasc', label: t('Date Asc') },
            { value: 'nameasc', label: t('Name Asc') },
            { value: 'namedesc', label: t('Name Desc') }
        ];

        let pager = [];
        let pages = _.range(0, Math.ceil(decks.length / this.state.pageSize));
        for(let page of pages) {
            pager.push(<li key={ page }><a href='#' className={ (page === this.state.currentPage ? 'active' : null) } onClick={ this.onPageChanged.bind(this, page) }>{ page + 1 }</a></li>);
        }

        return (
            <div className={ className }>
                <form className='form'>
                    <div className='col-md-8'>
                        <div className='form-group'>
                            <label className='control-label'><Trans>Filter</Trans>:</label><input className='form-control' placeholder={ t('Search...') } type='text' onChange={ e => this.changeFilter(e.target.value) }/>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='form-group'>
                            <label className='control-label'><Trans>Show</Trans>:</label>
                            <select className='form-control' onChange={ this.onPageSizeChanged }>
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                        </div>

                    </div>
                    <div className='col-md-12'><Trans>Sort by</Trans>:<RadioGroup buttons={ sortButtons } onValueSelected={ this.onSortChanged } defaultValue={ this.state.sortOrder } /></div>
                    <nav className='col-md-12' aria-label={ t('Page navigation') } >
                        <ul className='pagination'>
                            <li>
                                <a href='#' aria-label={ t('Previous') } onClick={ this.onPageChanged.bind(this, 0) }>
                                    <span aria-hidden='true'>&laquo;</span>
                                </a>
                            </li>
                            { pager }
                            <li>
                                <a href='#' aria-label={ t('Next') } onClick={ this.onPageChanged.bind(this, pages.length - 1) }>
                                    <span aria-hidden='true'>&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </form>
                <div className='col-md-12'>{ deckRows }</div>
            </div>);
    }
}

DeckList.propTypes = {
    activeDeck: PropTypes.object,
    className: PropTypes.string,
    decks: PropTypes.array,
    i18n: PropTypes.object,
    onSelectDeck: PropTypes.func,
    t: PropTypes.func
};

export default withTranslation()(DeckList);
