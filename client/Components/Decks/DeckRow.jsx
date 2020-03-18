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
            .then(imageUrl => {
                this.setState({ imageUrl });
            });
    }

    componentDidUpdate(prevProps) {
        if(this.props.i18n.language !== prevProps.i18n.language) {
            buildArchon(this.props.deck, this.props.i18n.language)
                .then(imageUrl => {
                    this.setState({ imageUrl });
                });
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
                <span className='col-xs-8 col-md-7 col-lg-9 deck-name'>
                    { this.props.deck.name }
                </span>
                <div className='row small'>
                    <span className='col-xs-12 deck-date text-right pull-right'>
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
