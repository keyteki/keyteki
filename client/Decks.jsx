import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import {connect} from 'react-redux';

import DeckSummary from './DeckSummary.jsx';
import Link from './Link.jsx';
import DeckRow from './DeckRow.jsx';

import * as actions from './actions';

class InnerDecks extends React.Component {
    constructor() {
        super();

        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onConfirmDeleteClick = this.onConfirmDeleteClick.bind(this);
        this.onEditClick = this.onEditClick.bind(this);

        this.state = {
            loaded: false,
            decks: [],
            error: '',
            showDelete: false
        };
    }

    componentWillMount() {
        $.ajax({
            url: '/api/decks',
            type: 'GET',
            cache: false
        }).done((data) => {
            this.setState({ loaded: true });

            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }

            this.setState({ decks: data.decks });

            if(data.decks.length !== 0) {
                this.setState({ selectedDeck: 0 });
            }
        }).fail(() => {
            this.setState({ loaded: true, error: 'Could not communicate with the server.  Please try again later.' });
        });
    }

    onSelectionChanged(newIndex) {
        this.setState({ selectedDeck: newIndex });
    }

    onDeleteClick(event) {
        event.preventDefault();

        this.setState({ showDelete: !this.state.showDelete });
    }

    onEditClick(event) {
        event.preventDefault();

        var selectedDeck = this.state.decks[this.state.selectedDeck];


        this.props.navigate('/decks/edit/' + selectedDeck._id);
    }

    onConfirmDeleteClick(event) {
        event.preventDefault();

        var selectedDeck = undefined;

        if(this.state.selectedDeck !== undefined) {
            selectedDeck = this.state.decks[this.state.selectedDeck];
        }

        $.ajax({
            url: '/api/decks/' + selectedDeck._id,
            type: 'DELETE'
        }).done(data => {
            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }

            this.setState({
                decks: _.reject(this.state.decks, deck => {
                    return deck._id === selectedDeck._id;
                })
            });
        }).fail(() => {
            this.setState({ error: 'Could not communicate with the server.  Please try again later.' });
        });

        this.setState({ showDelete: false });
    }

    render() {
        var errorBar = this.state.error ? <div className='alert alert-danger' role='alert'>{this.state.error}</div> : null;
        var index = 0;

        var decks = _.map(this.state.decks, deck => {
            var row = <DeckRow key={deck.name + index.toString()} deck={deck} onClick={this.onSelectionChanged.bind(this, index)} active={index === this.state.selectedDeck} />;

            index++;

            return row;
        });

        var deckList = (
            <div>
                {decks}
            </div>
        );

        var deckInfo = null;

        if(this.state.selectedDeck !== undefined) {
            var selectedDeck = undefined;
            selectedDeck = this.state.decks[this.state.selectedDeck];

            if(selectedDeck) {
                deckInfo = (<div className='col-sm-6'>
                    <div className='btn-group'>
                        <button className='btn btn-primary' onClick={this.onEditClick}>Edit</button>
                        <button className='btn btn-primary' onClick={this.onDeleteClick}>Delete</button>
                        {this.state.showDelete ?
                            <button className='btn btn-danger' onClick={this.onConfirmDeleteClick}>Delete</button> :
                            null}
                    </div>
                    <DeckSummary name={selectedDeck.name} faction={selectedDeck.faction} 
                        provinceCards={selectedDeck.provinceCards} stronghold={selectedDeck.stronghold} conflictDrawCards={selectedDeck.conflictDrawCards} dynastyDrawCards={selectedDeck.dynastyDrawCards} allianceFaction={selectedDeck.allianceFaction}
                        cards={this.props.cards} />
                </div>);
            } else {
                deckInfo = null;
            }
        }

        return (
            <div>
                {this.state.loaded ?
                <div>
                    {errorBar}
                    <div className='col-sm-6'>
                        <Link className='btn btn-primary' href='/decks/add'>Add new deck</Link>
                        <div className='deck-list'>{this.state.decks.length === 0 ? 'You have no decks, try adding one.' : deckList}</div>
                    </div>
                    {deckInfo}
                </div>
                : <div>Loading decks from the server...</div>}
            </div>);
    }
}

InnerDecks.displayName = 'Decks';
InnerDecks.propTypes = {
    cards: React.PropTypes.array,
    navigate: React.PropTypes.func
};

function mapStateToProps(state) {
    return {
        cards: state.cards.cards
    };
}

const Decks = connect(mapStateToProps, actions)(InnerDecks);

export default Decks;
