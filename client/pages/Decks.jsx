import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Link from '../Components/Navigation/Link';
import DeckList from '../Components/Decks/DeckList';
import ViewDeck from '../Components/Decks/ViewDeck';
import * as actions from '../redux/actions';

import { withTranslation, Trans } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';

class Decks extends React.Component {
    constructor(props) {
        super(props);

        this.handleDeleteDeck = this.handleDeleteDeck.bind(this);
    }

    componentDidMount() {
        //   this.props.loadDecks();
    }

    handleDeleteDeck(deck) {
        this.props.deleteDeck(deck);
    }

    render() {
        let t = this.props.t;
        let content = null;

        let successPanel = null;

        if (this.props.deckDeleted) {
            setTimeout(() => {
                this.props.clearDeckStatus();
            }, 5000);
            successPanel = <AlertPanel message={t('Deck deleted successfully')} type={'success'} />;
        }

        if (this.props.apiLoading) {
            content = (
                <div>
                    <Trans>Loading decks from the server...</Trans>
                </div>
            );
        } else if (this.props.apiSuccess === false) {
            content = <AlertPanel type='error' message={this.props.apiMessage} />;
        } else {
            content = (
                <div className='full-height'>
                    <Col sm={12}>{successPanel}</Col>
                    <Row>
                        <Col md={6} className='full-height'>
                            <Panel title={t('Your decks')}>
                                <Link className='btn btn-primary' href='/decks/import'>
                                    <Trans>Import Deck</Trans>
                                </Link>
                                <DeckList
                                    className='deck-list'
                                    // activeDeck={this.props.selectedDeck}
                                    // onSelectDeck={this.props.selectDeck}
                                />
                            </Panel>
                        </Col>
                        {!!this.props.selectedDeck && (
                            <ViewDeck
                                deck={this.props.selectedDeck}
                                cards={this.props.cards}
                                onDeleteDeck={this.handleDeleteDeck}
                            />
                        )}
                    </Row>
                </div>
            );
        }

        return content;
    }
}

Decks.displayName = 'Decks';
Decks.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    cards: PropTypes.object,
    clearDeckStatus: PropTypes.func,
    deckDeleted: PropTypes.bool,
    //    decks: PropTypes.array,
    deleteDeck: PropTypes.func,
    i18n: PropTypes.object,
    loadDecks: PropTypes.func,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    //numDecks: PropTypes.number,
    selectDeck: PropTypes.func,
    selectedDeck: PropTypes.object,
    t: PropTypes.func
};

function mapStateToProps(state) {
    return {
        //    apiLoading: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.loading : undefined,
        //apiMessage: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.message : undefined,
        //apiSuccess: state.api.REQUEST_DECKS ? state.api.REQUEST_DECKS.success : undefined,
        cards: state.cards.cards,
        deckDeleted: state.cards.deckDeleted,
        //decks: state.cards.decks,
        loading: state.api.loading,
        //        numDecks: state.cards.numDecks,
        selectedDeck: state.cards.selectedDeck
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Decks));
