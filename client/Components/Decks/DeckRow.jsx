import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { withTranslation } from 'react-i18next';

class DeckRow extends React.Component {
    constructor() {
        super();

        this.handleDeckClick = this.handleDeckClick.bind(this);
    }

    handleDeckClick() {
        if(this.props.onSelect) {
            this.props.onSelect(this.props.deck);
        }
    }

    getStatusName(status) {
        if(status.usageLevel === 1 && !status.verified) {
            return 'Used';
        } else if(status.usageLevel === 2 && !status.verified) {
            return 'Popular';
        } else if(status.usageLevel === 3 && !status.verified) {
            return 'Notorious';
        } else if(!status.officialRole || !status.noUnreleasedCards || !status.faqRestrictedList) {
            return 'Casual';
        }

        return 'Valid';
    }

    render() {
        let { i18n, t } = this.props;
        moment.locale((i18n.language === 'zhhans') || (i18n.language === 'zhhant') ? 'zh-cn' : i18n.language);

        return (
            <div className={ this.props.active ? 'deck-row active' : 'deck-row' } key={ this.props.deck.name } onClick={ this.handleDeckClick }>
                <div className='col-xs-1 deck-image'>
                    <img className='img-responsive' src={ '/img/idbacks/identity.jpg' } />
                </div>
                <span className='col-xs-8 col-md-7 col-lg-9 deck-name'>{ this.props.deck.name }</span><span className='col-xs-2 col-md-3 col-lg-2 deck-status-label text-right pull-right'>{ t(this.getStatusName(this.props.deck.status)) }</span>
                <div className='row small'>
                    <span className='col-xs-8 col-md-7 col-lg-9 deck-house-icons'><img className='deck-sm-house' src={ '/img/house/' + this.props.deck.houses[0] + '.png' } />/<img className='deck-sm-house' src={ '/img/house/' + this.props.deck.houses[1] + '.png' } />/<img className='deck-sm-house' src={ '/img/house/' + this.props.deck.houses[2] + '.png' } /></span>
                    <span className='col-xs-4 col-md-3 deck-date text-right pull-right'>{ moment(this.props.deck.lastUpdated).format('Do MMM YYYY') }</span>
                </div>
            </div>);
    }
}

DeckRow.displayName = 'DeckRow';
DeckRow.propTypes = {
    active: PropTypes.bool,
    deck: PropTypes.object.isRequired,
    i18n: PropTypes.object,
    onSelect: PropTypes.func,
    t: PropTypes.func
};

export default withTranslation()(DeckRow);
