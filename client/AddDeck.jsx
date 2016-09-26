import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import {connect} from 'react-redux';
import Input from './FormComponents/Input.jsx';
import Select from './FormComponents/Select.jsx';
import Typeahead from './FormComponents/Typeahead.jsx';
import TextArea from './FormComponents/TextArea.jsx';
import DeckSummary from './DeckSummary.jsx';

import * as actions from './actions';

class InnerAddDeck extends React.Component {
    constructor() {
        super();

        this.state = this.getDefaultState();

        this.verifyDeckname = this.verifyDeckname.bind(this);
        this.onFactionChange = this.onFactionChange.bind(this);
        this.onAgendaChange = this.onAgendaChange.bind(this);
        this.onAddCard = this.onAddCard.bind(this);
        this.addCardChange = this.addCardChange.bind(this);
        this.onCardListChange = this.onCardListChange.bind(this);
        this.onAddDeck = this.onAddDeck.bind(this);
    }

    getDefaultState() {
        return {
            error: '',
            deckname: 'New Deck',
            selectedFaction: {
                name: 'House Baratheon',
                value: 'baratheon'
            },
            selectedAgenda: {},
            cardToAdd: {},
            numberToAdd: 1,
            validation: {
                deckname: '',
                cardToAdd: ''
            },
            drawCards: [],
            plotCards: [],
            factions: [
                { name: 'House Baratheon', value: 'baratheon' },
                { name: 'House Greyjoy', value: 'greyjoy' },
                { name: 'House Lannister', value: 'lannister' },
                { name: 'House Martell', value: 'martell' },
                { name: 'The Night\'s Watch', value: 'thenightswatch' },
                { name: 'House Stark', value: 'stark' },
                { name: 'House Targaryen', value: 'targaryen' },
                { name: 'House Tyrell', value: 'tyrell' }
            ],
            cardList: ''
        };
    }

    verifyDeckname() {
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onFactionChange(event) {
        var faction = _.find(this.state.factions, (faction) => {
            return faction.value === event.target.value;
        });

        this.setState({ selectedFaction: faction });
    }

    onAgendaChange(event) {
        if(!event.target.value || event.target.value === '') {
            this.setState({ selectedAgenda: { code: '' } });
            return;
        }
        
        var agenda = _.find(this.props.agendas, function(agenda) {
            return agenda.code === event.target.value;
        });

        this.setState({ selectedAgenda: agenda });
    }

    onCardListChange(event) {
        var split = event.target.value.split('\n');

        this.setState({ drawCards: [], plotCards: [] }, () => {
            _.each(split, line => {
                var index = 2;

                if(!$.isNumeric(line[0])) {
                    return;
                }

                var num = parseInt(line[0]);
                if(line[1] === 'x') {
                    index++;
                }

                var packOffset = line.indexOf('(');
                var cardName = line.substr(index, packOffset === -1 ? line.length : packOffset - index - 1);
                var packName = line.substr(packOffset + 1, line.length - packOffset - 2);

                var pack = _.find(this.props.packs, function(pack) {
                    return pack.name === packName;
                });

                var card = _.find(this.props.cards, function(card) {
                    if(pack) {
                        return card.label.toLowerCase() === cardName.toLowerCase() || card.label.toLowerCase() === (cardName + ' (' + pack.code + ')').toLowerCase();
                    }

                    return card.label.toLowerCase() === cardName.toLowerCase();
                });

                if(card) {
                    this.addCard(card, num);
                }
            });
        });

        this.setState({ cardList: event.target.value });
    }

    addCardChange(selectedCards) {
        this.setState({ cardToAdd: selectedCards[0] });
    }

    addCard(card, number) {
        var plots = this.state.plotCards;
        var draw = this.state.drawCards;

        var list;

        if(card.type_code === 'plot') {
            list = plots;
        } else {
            list = draw;
        }

        if(list[card.code]) {
            list[card.code].count += number;
        } else {
            list.push({ count: number, card: card });
        }

        this.setState({ plotCards: plots, drawCards: draw });
    }

    onAddCard(event) {
        event.preventDefault();

        var cardList = this.state.cardList;

        cardList += this.state.numberToAdd + ' ' + this.state.cardToAdd.label + '\n';

        this.addCard(this.state.cardToAdd, parseInt(this.state.numberToAdd));

        this.setState({ cardList: cardList });
    }

    onAddDeck(event) {
        event.preventDefault();

        var str = JSON.stringify({
            deckName: this.state.deckname,
            faction: this.state.selectedFaction,
            agenda: this.state.selectedAgenda,
            plotCards: this.state.plotCards,
            drawCards: this.state.drawCards
        });

        $.post('/api/decks/new', { data: str }).done((data) => {
            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }

            this.props.navigate('/decks');
        }).fail(() => {
            this.setState({ error: 'Could not communicate with the server.  Please try again later.' });
        });
    }

    render() {
        var errorBar = this.state.error ? <div className='alert alert-danger' role='alert'>{ this.state.error }</div> : null;

        return (
            <div>
                { errorBar }
                <form className='form form-horizontal col-sm-6'>
                    <Input name='deckname' label='Deck Name' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Deck Name'
                        type='text' onChange={ this.onChange.bind(this, 'deckname') } value={ this.state.deckname } />
                    <Select name='faction' label='Faction' labelClass='col-sm-3' fieldClass='col-sm-9' options={ this.state.factions }
                        onChange={ this.onFactionChange } value={ this.state.selectedFaction.value } />
                    <Select name='agenda' label='Agenda' labelClass='col-sm-3' fieldClass='col-sm-9' options={ this.props.agendas }
                        onChange={ this.onAgendaChange } value={ this.state.selectedAgenda.code }
                        valueKey='code' nameKey='label' blankOption={ { label: '- Select -', code: '' } } />
                    <Typeahead label='Card' labelClass={ 'col-sm-3' } fieldClass='col-sm-4' labelKey={ 'label' } options={ this.props.cards }
                        onChange={ this.addCardChange }>
                        <Input name='numcards' type='text' label='Num' labelClass='col-sm-1' fieldClass='col-sm-2' value={ this.state.numberToAdd.toString() }
                            onChange={ this.onChange.bind(this, 'numberToAdd') }>
                            <div className='col-sm-1'>
                                <button className='btn btn-default' onClick={ this.onAddCard }>Add</button>
                            </div>
                        </Input>
                    </Typeahead>
                    <TextArea label='Cards' labelClass='col-sm-3' fieldClass='col-sm-9' rows='25' value={ this.state.cardList }
                        onChange={ this.onCardListChange } />
                    <div className='form-group'>
                        <div className='col-sm-offset-3 col-sm-8'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onAddDeck }>Add Deck</button>
                        </div>
                    </div>
                </form>
                <DeckSummary className='col-sm-6 right-pane' cards={ this.props.cards } name={ this.state.deckname } agenda={ this.state.selectedAgenda }
                    faction={ this.state.selectedFaction } plotCards={ this.state.plotCards } drawCards={ this.state.drawCards } />
            </div>);
    }
}

InnerAddDeck.displayName = 'InnerAddDeck';
InnerAddDeck.propTypes = {
    agendas: React.PropTypes.array,
    cards: React.PropTypes.array,
    navigate: React.PropTypes.func,
    packs: React.PropTypes.array
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket
    };
}

const AddDeck = connect(mapStateToProps, actions)(InnerAddDeck);

export default AddDeck;
