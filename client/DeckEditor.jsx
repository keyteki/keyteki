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
        this.onAgendaChange = this.onAgendaChange.bind(this);
        this.onBannerChange = this.onBannerChange.bind(this);
        this.onAddCard = this.onAddCard.bind(this);
        this.onAddBanner = this.onAddBanner.bind(this);
        this.addCardChange = this.addCardChange.bind(this);
        this.onCardListChange = this.onCardListChange.bind(this);
        this.onBannerListChange = this.onBannerListChange.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);

        this.state = {
            cardList: '',
            bannerList: '',
            deckName: props.deckName || 'New Deck',
            drawCards: props.drawCards || [],
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
            banners: [
                { name: 'Banner of the Dragon', value: 'Banner of the Dragon'},
                { name: 'Banner of the Kraken', value:  'Banner of the Kraken'},
                { name: 'Banner of the Lion', value: 'Banner of the Lion'},
                { name: 'Banner of the Rose', value: 'Banner of the Rose'},
                { name: 'Banner of the Stag', value: 'Banner of the Stag'},
                { name: 'Banner of the Sun', value: 'Banner of the Sun'},
                { name: 'Banner of the Watch', value: 'Banner of the Watch'},
                { name: 'Banner of the Wolf', value: 'Banner of the Wolf'}
            ],
            numberToAdd: 1,
            plotCards: props.plotCards || [],
            bannerCards: props.bannerCards || [],
            selectedAgenda: props.agenda || {},
            selectedBanner: {},
            bannersVisible: (props.agenda && props.agenda.name === 'Alliance') || false,
            selectedFaction: props.faction || {
                name: 'House Baratheon',
                value: 'baratheon'
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
        if(this.props.bannerCards) {
            _.each(this.props.bannerCards, card => {
                bannerList += ' ' + card.label + '\n';
            });
            this.setState({bannerList: bannerList});
        }
        if(this.props.drawCards || this.props.plotCards) {
            _.each(this.props.drawCards, card => {
                cardList += card.count + ' ' + card.card.label + '\n';
            });

            _.each(this.props.plotCards, card => {
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
            selectedAgenda: this.state.selectedAgenda,
            plotCards: this.state.plotCards,
            drawCards: this.state.drawCards,
            bannerCards: this.state.bannerCards
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

    onAgendaChange(event) {
        if(!event.target.value || event.target.value === '') {
            this.setState({ selectedAgenda: { code: '' } }, () => this.raiseDeckChanged());
            return;
        }

        var agenda = _.find(this.props.agendas, function(agenda) {
            return agenda.code === event.target.value;
        });
        this.setState({ bannersVisible: agenda.name === 'Alliance'});
        this.setState({ selectedAgenda: agenda }, () => this.raiseDeckChanged());
    }

    onBannerChange(event) {
        if(!event.target.value || event.target.value === '') {
            this.setState({ selectedBanner: { code: '' } }, () => this.raiseDeckChanged());
            return;
        }

        var banner = _.find(this.props.agendas, function(agenda) {
            return agenda.name === event.target.value;
        });      
        this.setState({ selectedBanner: banner }, () => this.raiseDeckChanged());
    }
    addBanner(card) {
        var list = this.state.bannerCards;
        list.push(card);
        this.setState({bannerCards: list});
    }
    onAddBanner(event) {
        event.preventDefault();
        this.addBanner(this.state.selectedBanner);
        var bannerList = this.state.bannerList;
        bannerList += this.state.selectedBanner.label + '\n';
        this.setState({ bannerList: bannerList }, () => this.raiseDeckChanged());
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

    onBannerListChange(event) {
       
        var split = event.target.value.split('\n');
        this.setState({bannerCards: []}, () => {
            _.each(split, line => {
                line = line.trim();
                var card = _.find(this.props.cards, function(card) {
                    return card.label.toLowerCase() === line.toLowerCase();
                });
                if(card) {
                    this.addBanner(card);
                }
            });
        });
        this.setState({ bannerList: event.target.value }, () => this.raiseDeckChanged());
    }

    onCardListChange(event) {
        var split = event.target.value.split('\n');

        this.setState({ drawCards: [], plotCards: [] }, () => {
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

        this.setState({ plotCards: plots, drawCards: draw }, () => this.raiseDeckChanged());
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
                <h4>Either type the cards manually into the box below, add the cards one by one using the card box and autocomplete or for best results, copy and paste a decklist from <a href='http://thronesdb.com' target='_blank'>Thrones DB</a> into the box below.</h4>
                <form className='form form-horizontal'>
                    <Input name='deckName' label='Deck Name' labelClass='col-sm-3' fieldClass='col-sm-9' placeholder='Deck Name'
                        type='text' onChange={this.onChange.bind(this, 'deckName')} value={this.state.deckName} />
                    <Select name='faction' label='Faction' labelClass='col-sm-3' fieldClass='col-sm-9' options={this.state.factions}
                        onChange={this.onFactionChange} value={this.state.selectedFaction.value} />
                    <Select name='agenda' label='Agenda' labelClass='col-sm-3' fieldClass='col-sm-9' options={this.props.agendas}
                        onChange={this.onAgendaChange} value={this.state.selectedAgenda.code}
                        valueKey='code' nameKey='label' blankOption={{ label: '- Select -', code: '' }} />

                    {this.state.bannersVisible &&
                    <div>
                        <Select name='banners' label ='Banners' labelClass='col-sm-3' fieldClass='col-sm-9' options={this.state.banners}
                            onChange={this.onBannerChange} value={this.state.selectedBanner.name} blankOption={{ name: '- Select -', code: '' }} button={{ text:'Add', onClick: this.onAddBanner}} />
                        <TextArea label='Banners' labelClass='col-sm-3' fieldClass='col-sm-9' disabled='disabled' rows='2' value={this.state.bannerList}
                            onChange={this.onBannerListChange} />
                    </div>
                    }
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
    bannerCards: React.PropTypes.array,
    cards: React.PropTypes.array,
    deckName: React.PropTypes.string,
    drawCards: React.PropTypes.array,
    faction: React.PropTypes.object,
    mode: React.PropTypes.string,
    onDeckChange: React.PropTypes.func,
    onDeckSave: React.PropTypes.func,
    packs: React.PropTypes.array,
    plotCards: React.PropTypes.array
};

export default DeckEditor;
