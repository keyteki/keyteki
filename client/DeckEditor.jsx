import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import Input from './FormComponents/Input.jsx';
import Select from './FormComponents/Select.jsx';
import Typeahead from './FormComponents/Typeahead.jsx';
import TextArea from './FormComponents/TextArea.jsx';

class DeckEditor extends React.Component {
    constructor(props) {
        super(props);

        this.onFactionChange = this.onFactionChange.bind(this);
        this.onAllyChange = this.onAllyChange.bind(this);
        this.onAddCard = this.onAddCard.bind(this);
        this.addCardChange = this.addCardChange.bind(this);
        this.onCardListChange = this.onCardListChange.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);

        this.state = {
            cardList: '',
            deckName: props.deckName || 'New Deck',
            drawCards: props.drawCards || [],
            factions: [
                { name: 'Crab Clan', value: 'crab' },
                { name: 'Crane Clan', value: 'crane' },
                { name: 'Dragon Clan', value: 'dragon' },
                { name: 'Lion Clan', value: 'lion' },
                { name: 'Phoenix Clan', value: 'phoenix' },
                { name: 'Scorpion Clan', value: 'scorpion' },
                { name: 'Unicorn Clan', value: 'unicorn' }
            ],
            allianceFactions: [
                { name: 'None', value: 'none' },
                { name: 'Crab Clan', value: 'crab' },
                { name: 'Crane Clan', value: 'crane' },
                { name: 'Dragon Clan', value: 'dragon' },
                { name: 'Lion Clan', value: 'lion' },
                { name: 'Phoenix Clan', value: 'phoenix' },
                { name: 'Scorpion Clan', value: 'scorpion' },
                { name: 'Unicorn Clan', value: 'unicorn' }
            ],            
            numberToAdd: 1,
            provinceCards: props.provinceCards || [],
            conflictDrawCards: props.conflictDrawCards || [],
            dynastyDrawCards: props.dynastyDrawCards || [],
            selectedFaction: props.faction || {
                name: 'Crab Clan',
                value: 'crab'
            },
            selectedAlly: props.allianceFaction || {
                name: 'None',
                value: 'none'
            },
            validation: {
                deckname: '',
                cardToAdd: ''
            }
        };
    }

    componentWillMount() {
        var cardList = '';
        if(this.props.drawCards || this.props.provinceCards || this.props.conflictDrawCards || this.props.dynastyDrawCards) {
            _.each(this.props.drawCards, card => {
                cardList += card.count + ' ' + card.card.label + '\n';
            });

             _.each(this.props.conflictDrawCards, card => {
                cardList += card.count + ' ' + card.card.label + '\n';
            });

              _.each(this.props.dynastyDrawCards, card => {
                cardList += card.count + ' ' + card.card.label + '\n';
            });

            _.each(this.props.provinceCards, card => {
                cardList += card.count + ' ' + card.card.label + '\n';
            });

            this.setState({ cardList: cardList });
        }

        this.raiseDeckChanged();
    }

    raiseDeckChanged() {
        if(this.props.onDeckChange) {
            this.props.onDeckChange(this.buildDeck());
        }
    }

    buildDeck() {
        return {
            name: this.state.deckName,
            selectedFaction: this.state.selectedFaction,
            selectedAlly: this.state.selectedAlly,
            provinceCards: this.state.provinceCards,
            drawCards: this.state.drawCards,
            conflictDrawCards: this.state.conflictDrawCards,
            dynastyDrawCards: this.state.dynastyDrawCards
        };
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState, () => this.raiseDeckChanged());
    }

    onFactionChange(event) {
        var faction = _.find(this.state.factions, (faction) => {
            return faction.value === event.target.value;
        });

        this.setState({ selectedFaction: faction }, () => this.raiseDeckChanged());
    }

    onAllyChange(event) {
        var alliance = _.find(this.state.allianceFactions, (alliance) => {
            return alliance.value === event.target.value;
        });

        this.setState({ selectedAlly: alliance }, () => this.raiseDeckChanged());
    }

    addCardChange(selectedCards) {
        this.setState({ cardToAdd: selectedCards[0] });
    }

    onAddCard(event) {
        event.preventDefault();

        if(!this.state.cardToAdd || !this.state.cardToAdd.label) {
            return;
        }

        var cardList = this.state.cardList;
        cardList += this.state.numberToAdd + ' ' + this.state.cardToAdd.label + '\n';

        this.addCard(this.state.cardToAdd, parseInt(this.state.numberToAdd));
        this.setState({ cardList: cardList }, () => this.raiseDeckChanged());
    }

    onCardListChange(event) {
        var split = event.target.value.split('\n');

        var headerMark = _.findIndex(split, line => line.match(/^Packs:/));
        if(headerMark >= 0) { // FiveringssDB-style deck header found
                              // extract deck title, faction, agenda, and banners
            var header = _.filter(_.first(split, headerMark), line => line !== '');
            split = _.rest(split, headerMark);

            if(header.length >= 2) {
                this.setState({ deckName: header[0] });

                var faction = _.find(this.state.factions, faction => faction.name === header[1]);
                if(faction) {
                    this.setState({ selectedFaction: faction }, () => this.raiseDeckChanged());
                }

                var alliance = _.find(this.state.allianceFactions, alliance => alliance.name === header[2]);
                if(alliance) {
                    this.setState({ selectedAlly: alliance }, () => this.raiseDeckChanged());
                }

            }
        }

        this.setState({ drawCards: [], provinceCards: [], conflictDrawCards: [], dynastyDrawCards: [] }, () => {
            _.each(split, line => {
                line = line.trim();
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
                    return pack.code === packName || pack.name === packName;
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
            }, () => this.raiseDeckChanged());
        });

        this.setState({ cardList: event.target.value }, () => this.raiseDeckChanged());
    }

    addCard(card, number) {
        var provinces = this.state.provinceCards;
        var draw = this.state.drawCards;
        var conflict = this.state.conflictDrawCards;
        var dynasty = this.state.dynastyDrawCards;

        var list;

        if(card.type_code === 'province') {
            list = provinces;
        } else if(card.deck === 'dynasty') {
            list = dynasty;
        } else if(card.deck === 'conflict') {
            list = conflict;
        } else {
            list = draw;
        }

        if(list[card.code]) {
            list[card.code].count += number;
        } else {
            list.push({ count: number, card: card });
        }

        this.setState({ provinceCards: provinces, drawCards: draw, conflictDrawCards: conflict, dynastyDrawCards: dynasty }, () => this.raiseDeckChanged());
    }

    onSaveClick(event) {
        event.preventDefault();

        if(this.props.onDeckSave) {
            this.props.onDeckSave(this.buildDeck());
        }
    }

    render() {
        return (
            <div className='col-sm-6'>
                <h2>Deck Editor</h2>
                <h4>Either type the cards manually into the box below, add the cards one by one using the card box and autocomplete or for best results, copy and paste a decklist from <a href='http://fiveringsdb.com' target='_blank'>FiveRings DB</a> into the box below.</h4>
                <form className='form form-horizontal'>
                    <Input name='deckName' label='Deck Name' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Deck Name'
                        type='text' onChange={this.onChange.bind(this, 'deckName')} value={this.state.deckName} />
                    <Select name='faction' label='Clan' labelClass='col-sm-3' fieldClass='col-sm-9' options={this.state.factions}
                        onChange={this.onFactionChange} value={this.state.selectedFaction.value} />
                    <Select name='alliance' label='Alliance' labelClass='col-sm-3' fieldClass='col-sm-9' options={this.state.allianceFactions}
                        onChange={this.onAllyChange} value={this.state.selectedAlly.value} />


                    <Typeahead label='Card' labelClass={'col-sm-3'} fieldClass='col-sm-4' labelKey={'label'} options={this.props.cards}
                        onChange={this.addCardChange}>
                        <Input name='numcards' type='text' label='Num' labelClass='col-sm-1' fieldClass='col-sm-2'
                            value={this.state.numberToAdd.toString()} onChange={this.onChange.bind(this, 'numberToAdd')}>
                            <div className='col-sm-1'>
                                <button className='btn btn-default' onClick={this.onAddCard}>Add</button>
                            </div>
                        </Input>
                    </Typeahead>
                    <TextArea label='Cards' labelClass='col-sm-3' fieldClass='col-sm-9' rows='25' value={this.state.cardList}
                        onChange={this.onCardListChange} />
                    <div className='form-group'>
                        <div className='col-sm-offset-3 col-sm-8'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={this.onSaveClick}>{this.props.mode}</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

DeckEditor.displayName = 'DeckEditor';
DeckEditor.propTypes = {
    cards: React.PropTypes.array,
    deckName: React.PropTypes.string,
    drawCards: React.PropTypes.array,
    conflictDrawCards: React.PropTypes.array,
    dynastyDrawCards: React.PropTypes.array,
    faction: React.PropTypes.object,
    allianceFaction: React.PropTypes.object,
    mode: React.PropTypes.string,
    onDeckChange: React.PropTypes.func,
    onDeckSave: React.PropTypes.func,
    packs: React.PropTypes.array,
    provinceCards: React.PropTypes.array
};

export default DeckEditor;
