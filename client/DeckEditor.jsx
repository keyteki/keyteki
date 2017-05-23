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
        this.onAddAlly = this.onAddAlly.bind(this);
        this.addCardChange = this.addCardChange.bind(this);
        this.onCardListChange = this.onCardListChange.bind(this);
        this.onAllyListChange = this.onAllyListChange.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);

        this.state = {
            cardList: '',
            bannerList: '',
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
            numberToAdd: 1,
            provinceCards: props.provinceCards || [],
            selectedFaction: props.faction || {
                name: 'Crab Clan',
                value: 'crab'
            },
            validation: {
                deckname: '',
                cardToAdd: ''
            }
        };
    }

    componentWillMount() {
        var cardList = '';
        var bannerList = '';
        if(this.props.allyCards) {
            _.each(this.props.allyCards, card => {
                allyList += ' ' + card.label + '\n';
            });
            this.setState({allyList: allysList});
        }
        if(this.props.drawCards || this.props.provinceCards) {
            _.each(this.props.drawCards, card => {
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
            provinceCards: this.state.provinceCards,
            drawCards: this.state.drawCards,
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
        if(!event.target.value || event.target.value === '') {
            this.setState({ selectedAlly: { code: '' } }, () => this.raiseDeckChanged());
            return;
        }

        var banner = _.find(this.props.agendas, function(agenda) {
            return agenda.name === event.target.value;
        });      
        this.setState({ selectedAlly: banner }, () => this.raiseDeckChanged());
    }

    addAlly(card) {
        var list = this.state.allyCards;
        list.push(card);
        this.setState({allyCards: list});
    }
    
    onAddAlly(event) {
        event.preventDefault();
        this.addAlly(this.state.selectedAlly);
        var allyList = this.state.allyList;
        allyList += this.state.selectedAlly.label + '\n';
        this.setState({ allyList: allyList }, () => this.raiseDeckChanged());
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

    onAllyListChange(event) {
       
        var split = event.target.value.split('\n');
        this.setState({allyCards: []}, () => {
            _.each(split, line => {
                line = line.trim();
                var card = _.find(this.props.cards, function(card) {
                    return card.label.toLowerCase() === line.toLowerCase();
                });
                if(card) {
                    this.addAlly(card);
                }
            });
        });
        this.setState({ allyList: event.target.value }, () => this.raiseDeckChanged());
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

                header = _.rest(header, 2);
                if(header.length >= 1) {
                    var rawAgenda = undefined;
                    if(_.contains(header, 'Alliance')) {
                        rawAgenda = 'Alliance';
                        var rawBanners = _.filter(header, line => line !== 'Alliance');
                    } else {
                        rawAgenda = header[0];
                    }

                    var agenda = _.find(this.props.agendas, agenda => agenda.name === rawAgenda);
                    if(agenda) {
                        this.setState({ bannersVisible: agenda.name === 'Alliance'});
                        this.setState({ selectedAgenda: agenda }, () => this.raiseDeckChanged());
                    }
                    if(rawBanners) {
                        this.setState({ bannerList: rawBanners.join('\n') }, () => this.raiseDeckChanged());
                    }
                }
            }
        }

        this.setState({ drawCards: [], provinceCards: [] }, () => {
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

        var list;

        if(card.type_code === 'province') {
            list = provinces;
        } else {
            list = draw;
        }

        if(list[card.code]) {
            list[card.code].count += number;
        } else {
            list.push({ count: number, card: card });
        }

        this.setState({ provinceCards: provinces, drawCards: draw }, () => this.raiseDeckChanged());
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
    agenda: React.PropTypes.object,
    agendas: React.PropTypes.array,
    allyCards: React.PropTypes.array,
    cards: React.PropTypes.array,
    deckName: React.PropTypes.string,
    drawCards: React.PropTypes.array,
    faction: React.PropTypes.object,
    mode: React.PropTypes.string,
    onDeckChange: React.PropTypes.func,
    onDeckSave: React.PropTypes.func,
    packs: React.PropTypes.array,
    provinceCards: React.PropTypes.array
};

export default DeckEditor;
