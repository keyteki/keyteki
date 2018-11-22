import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';

import AlertPanel from './SiteComponents/AlertPanel.jsx';
import DeckSummary from './DeckSummary.jsx';
import DeckRow from './DeckRow.jsx';
import Input from './FormComponents/Input.jsx';

import * as actions from './actions';

class InnerDecks extends React.Component {
    constructor() {
        super();

        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onConfirmDeleteClick = this.onConfirmDeleteClick.bind(this);
        this.onImportDeckClick = this.onImportDeckClick.bind(this);

        this.state = {
            decks: [],
            showDelete: false
        };
    }

    componentWillMount() {
        this.props.loadDecks();
    }

    onDeleteClick(event) {
        event.preventDefault();

        this.setState({ showDelete: !this.state.showDelete });
    }

    onEditClick(event) {
        event.preventDefault();

        this.props.navigate('/decks/edit');
    }

    onConfirmDeleteClick(event) {
        event.preventDefault();

        this.props.deleteDeck(this.props.selectedDeck);

        this.setState({ showDelete: false });
    }

    onImportDeckClick() {
        $(findDOMNode(this.refs.modal)).modal('show');
    }

    importDeck() {
        $(findDOMNode(this.refs.modal)).modal('hide');
        
        let importUrl = document.getElementById('importUrl').value;

        let split = String(importUrl).split('/');
        if(split[2] === 'www.keyforgegame.com' && split[3] === 'deck-details') {
            this.props.saveDeck({ uuid: split[4] });
        }
    }

    render() {
        var index = 0;

        var decks = _.map(this.props.decks, deck => {
            var row = (<DeckRow key={ deck.name + index.toString() } deck={ deck }
                onClick={ () => this.props.selectDeck(deck) }
                active={ this.props.selectedDeck && deck._id === this.props.selectedDeck._id } />);

            index++;

            return row;
        });

        var deckList = (
            <div>
                { decks }
            </div>
        );

        var deckInfo = null;

        if(this.props.selectedDeck) {
            deckInfo = (<div className='col-sm-7'>
                <div className='panel-title text-center col-xs-12'>
                    { this.props.selectedDeck.name }
                </div>
                <div className='panel col-xs-12'>
                    <div className='btn-group col-xs-12'>
                        <button className='btn btn-primary' onClick={ this.onDeleteClick }>Delete</button>
                        { this.state.showDelete ?
                            <button className='btn btn-danger' onClick={ this.onConfirmDeleteClick }>Delete</button> :
                            null }
                    </div>
                    <DeckSummary deck={ this.props.selectedDeck } cards={ this.props.cards } />
                </div>
            </div>);
        }

        let content = null;

        let successPanel = null;

        if(this.props.deckDeleted) {
            setTimeout(() => {
                this.props.clearDeckStatus();
            }, 5000);
            successPanel = (
                <AlertPanel message='Deck deleted successfully' type={ 'success' } />
            );
        }

        let popup = (
            <div id='decks-modal' ref='modal' className='modal fade' tabIndex='-1' role='dialog'>
                <div className='modal-dialog' role='document'>
                    <div className='modal-content deck-popup'>
                        <div className='modal-header'>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>×</span></button>
                            <h4 className='modal-title'>Provide Master Vault link</h4>
                        </div>
                        <div className='modal-body'>
                            <Input name='importUrl' fieldClass='col-sm-9' placeholder='link' type='text' >
                                <div className='col-sm-1'>
                                    <button className='btn btn-default' onClick={ this.importDeck.bind(this) }>Import</button>
                                </div>
                            </Input>
                        </div>
                    </div>
                </div>
            </div>);

        if(this.props.loading) {
            content = <div>Loading decks from the server...</div>;
        } else if(this.props.apiError) {
            content = <AlertPanel type='error' message={ this.props.apiError } />;
        } else {
            content = (
                <div className='full-height'>
                    { popup }
                    { successPanel }
                    <div className='col-sm-5 full-height'>
                        <div className='panel-title text-center'>
                            Your decks
                        </div>
                        <div className='panel deck-list-container'>
                            <span className='btn btn-primary' data-toggle='modal' data-target='#decks-modal'>Import deck</span>
                            <div className='deck-list'>{ !this.props.decks || this.props.decks.length === 0 ? 'You have no decks, try adding one.' : deckList }</div>
                        </div>
                    </div>
                    { deckInfo }
                </div>);
        }
        return content;
        /*
        */
    }
}

InnerDecks.displayName = 'Decks';
InnerDecks.propTypes = {
    apiError: PropTypes.string,
    cards: PropTypes.object,
    clearDeckStatus: PropTypes.func,
    deckDeleted: PropTypes.bool,
    decks: PropTypes.array,
    deleteDeck: PropTypes.func,
    loadDecks: PropTypes.func,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    saveDeck: PropTypes.func,
    selectDeck: PropTypes.func,
    selectedDeck: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        cards: state.cards.cards,
        deckDeleted: state.cards.deckDeleted,
        decks: state.cards.decks,
        loading: state.api.loading,
        selectedDeck: state.cards.selectedDeck
    };
}

const Decks = connect(mapStateToProps, actions)(InnerDecks);

export default Decks;
