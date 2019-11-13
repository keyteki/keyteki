import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { withTranslation } from 'react-i18next';
import { buildArchon } from '../../archonMaker';

class DeckRow extends React.Component {
    constructor(props) {
        super(props);
        this.handleDeckClick = this.handleDeckClick.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.state = {
            imageUrl: '',
            archonShow: false
        };
    }

    componentDidMount() {
        buildArchon(this.props.deck, this.props.i18n.language)
            .then(imageUrl => this.setState({ imageUrl }));
    }

    componentDidUpdate(prevProps) {
        if(this.props.i18n.language !== prevProps.i18n.language) {
            buildArchon(this.props.deck, this.props.i18n.language)
                .then(imageUrl => this.setState({ imageUrl }));
        }
    }

    onMouseOver() {
        this.setState({ archonShow: true });
    }


    onMouseOut() {
        this.setState({ archonShow: false });
    }

    handleDeckClick() {
        if(this.props.onSelect) {
            this.props.onSelect(this.props.deck);
        }
    }

    getStatusName(status) {
        let t = this.props.t;

        if(status.usageLevel === 1 && !status.verified) {
            return t('Used');
        } else if(status.usageLevel === 2 && !status.verified) {
            return t('Popular');
        } else if(status.usageLevel === 3 && !status.verified) {
            return t('Notorious');
        } else if(!status.officialRole || !status.noUnreleasedCards || !status.faqRestrictedList) {
            return t('Casual');
        }

        return t('Valid');
    }

    render() {
        let language = this.props.i18n.language;
        moment.locale((language === 'zhhans') || (language === 'zhhant') ? 'zh-cn' : language);

        return (
            <div className={ this.props.active ? 'deck-row active' : 'deck-row' } key={ this.props.deck.name } onClick={ this.handleDeckClick }>
                { this.state.archonShow &&
                <div className='hover-card'>
                    <div className='hover-image'>
                        <img className={ 'img-responsive' } src={ this.state.imageUrl }/>
                    </div>
                </div>
                }
                <div className='col-xs-1 deck-image'>
                    <img className={ 'img-responsive' } src={ this.state.imageUrl } onMouseOut={ this.onMouseOut } onMouseOver={ this.onMouseOver }/>
                </div>
                <span className='col-xs-8 col-md-7 col-lg-9 deck-name'>
                    { this.props.deck.name }
                </span>
                <span className='col-xs-2 col-md-3 col-lg-2 deck-status-label text-right pull-right'>
                    <img className='deck-expansion' src={ '/img/idbacks/' + this.props.deck.expansion + '.png' } />
                    { this.getStatusName(this.props.deck.status) }
                </span>
                <div className='row small'>
                    <span className='col-xs-8 col-md-7 col-lg-9 deck-house-icons'>
                        <img className='deck-sm-house' src={ '/img/house/' + this.props.deck.houses[0] + '.png' } />
                        <img className='deck-sm-house' src={ '/img/house/' + this.props.deck.houses[1] + '.png' } />
                        <img className='deck-sm-house' src={ '/img/house/' + this.props.deck.houses[2] + '.png' } />
                    </span>
                    <span className='col-xs-4 col-md-3 deck-date text-right pull-right'>
                        { moment(this.props.deck.lastUpdated).format('Do MMM YYYY') }
                    </span>
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
