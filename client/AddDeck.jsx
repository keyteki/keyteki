import React from 'react';
import { withRouter } from 'react-router';
import _ from 'underscore';
import $ from 'jquery';
import Typeahead from 'react-bootstrap-typeahead';

class AddDeck extends React.Component {
    constructor() {
        super();

        this.state = {
            error: '',
            deckname: 'New Deck',
            faction: 'baratheon',
            factionName: 'House Baratheon',
            agenda: '',
            agendaName: '',
            cardToAdd: {},
            numberToAdd: 1,
            cardToShow: undefined,
            validation: {
                deckname: '',
                cardToAdd: ''
            },
            drawCards: [],
            plotCards: [],
            agendas: [],
            cards: []
        };

        this.verifyDeckname = this.verifyDeckname.bind(this);
        this.onFactionChange = this.onFactionChange.bind(this);
        this.onAgendaChange = this.onAgendaChange.bind(this);
        this.onAddCard = this.onAddCard.bind(this);
        this.addCardChange = this.addCardChange.bind(this);
        this.onCardMouseOut = this.onCardMouseOut.bind(this);
        this.onCardMouseOver = this.onCardMouseOver.bind(this);

        this.fields = [
            {
                name: 'deckname',
                label: 'Deck Name',
                placeholder: 'Deck Name',
                inputType: 'text',
                blurCallback: this.verifyDeckname
            },
            {
                name: 'faction',
                label: 'Faction',
                inputType: 'select',
                options: [
                    { name: 'House Baratheon', value: 'baratheon' },
                    { name: 'House Greyjoy', value: 'greyjoy' },
                    { name: 'House Lannister', value: 'lannister' },
                    { name: 'House Martell', value: 'martell' },
                    { name: 'The Night\'s Watch', value: 'thenightswatch' },
                    { name: 'House Stark', value: 'stark' },
                    { name: 'House Targaryen', value: 'targaryen' },
                    { name: 'House Tyrell', value: 'tyrell' }
                ],
                mandatory: true,
                onChange: this.onFactionChange
            },
            {
                name: 'agenda',
                label: 'Agenda',
                inputType: 'select',
                options: _.map(this.state.agendas, function(agenda) {
                    return { name: agenda.label, value: agenda.code };
                }),
                onChange: this.onAgendaChange
            }
        ];
    }

    componentWillMount() {
        $.ajax({
            url: '/api/cards',
            type: 'GET'
        }).done((data) => {
            var agendas = _.filter(data.cards, function(card) {
                return card.type_code === 'agenda' && card.pack_code !== 'VDS';
            });

            this.setState({ cards: data.cards, agendas: agendas });
        });
    }

    verifyDeckname() {
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onFactionChange(event) {
        this.setState({ faction: event.target.value, factionName: event.target.options[event.target.selectedIndex].text });
    }

    onAgendaChange(event) {
        this.setState({ agenda: event.target.value, agendaName: event.target.options[event.target.selectedIndex].text });
    }

    onCardMouseOver(event) {
        var cardToDisplay = _.filter(this.state.cards, card => {
            return event.target.innerText === card.label;
        });

        this.setState({ cardToShow: cardToDisplay[0] });
    }

    onCardMouseOut() {
        this.setState({ cardToShow: undefined });
    }

    addCardChange(selectedCards) {
        this.setState({ cardToAdd: selectedCards[0] });
    }

    onAddCard(event) {
        var plots = this.state.plotCards;
        var draw = this.state.drawCards;

        event.preventDefault();

        if(this.state.cardToAdd.type_code === 'plot') {
            plots.push(this.state.cardToAdd);
        } else {
            if(draw[this.state.cardToAdd.code]) {
                draw[this.state.cardToAdd.code].count += parseInt(this.state.numberToAdd);
            } else {
                draw.push({ count: this.state.numberToAdd, card: this.state.cardToAdd });
            }
        }

        this.setState({ plotCards: plots, drawCards: draw });
    }

    getFieldsToRender() {
        var fieldsToRender = [];

        _.each(this.fields, (field) => {
            var className = 'form-group';
            var validation = null;

            if(this.state.validation[field.name]) {
                className += ' has-error';
                validation = <span className='help-block'>{ this.state.validation[field.name]}</span>;
            }

            var fieldToRender = {};

            if(field.inputType === 'select') {
                var options = [];

                if(!field.mandatory) {
                    options.push(<option key='default' value=''> --select an option-- </option>);
                }

                _.each(field.options, function(option) {
                    options.push(<option key={ option.value } value={ option.value }>{ option.name }</option>);
                });

                fieldToRender = (
                    <select ref={ field.name }
                        className='form-control'
                        id={ field.name }
                        onChange={ field.onChange }>
                        { options }
                        value={this.state[field.name]}
                    </select>);
            } else {
                fieldToRender = (
                    <input type={ field.inputType }
                        ref={ field.name }
                        className='form-control'
                        id={ field.name }
                        placeholder={ field.placeholder }
                        value={ this.state[field.name]}
                        onChange={ this.onChange.bind(this, field.name) }
                        onBlur={ field.blurCallback } />);
            }

            fieldsToRender.push(
                <div key={ field.name } className={ className }>
                    <label htmlFor={ field.name } className='col-sm-2 control-label'>{ field.label }</label>
                    <div className='col-sm-9'>
                        { fieldToRender }
                        { validation }
                    </div>
                </div>);
        });

        return fieldsToRender;
    }

    render() {
        var errorBar = this.state.error ? <div className='alert alert-danger' role='alert'>{ this.state.error }</div> : null;

        var fieldsToRender = this.getFieldsToRender();
        var plotsToRender = [];
        var cardsToRender = [];
        var groupedCards = {};
        
        _.each(this.state.drawCards, (card) => {
            if(!groupedCards[card.card.type_name]) {
                groupedCards[card.card.type_name] = [card];
            } else {
                groupedCards[card.card.type_name].push(card);
            }
        });

        _.each(this.state.plotCards, plot => {
            plotsToRender.push(<div onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut } id={ plot.code }>{ plot.label }</div>);
        });

        _.each(groupedCards, (cardList, key) => {
            var cards = [];
            var count = 0;

            _.each(cardList, card => {
                cards.push(<div><span>{card.count + 'x '}</span><span onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.card.label }</span></div>);
                count += parseInt(card.count);
            });

            cardsToRender.push(<div><h4>{ key + ' (' + count.toString() + ')' }</h4><div>{ cards }</div></div>);
        });

        var cardCount = 0;
        var cardList = '';

        _.each(this.state.drawCards, function(card) {
            cardCount += parseInt(card.count);
            cardList += card.count + ' ' + card.card.label + '\n';
        });

        return (
            <div>
                { errorBar }
                { this.state.cardToShow ? <img className='hover-image' src={ '/img/cards/' + this.state.cardToShow.code + '.png' } /> : null }
                <form className='form form-horizontal col-sm-6'>
                    { fieldsToRender }
                    <div className='form-group'>
                        <label className='col-sm-2 control-label'>Card</label>
                        <div className='col-sm-4'>
                            <Typeahead labelKey={ 'label' } options={ this.state.cards } onChange={ this.addCardChange } />
                        </div>
                        <div className='form-group'>
                            <label className='col-sm-1 control-label'>Num</label>
                            <div className='col-sm-1'>
                                <input className='form-control' type='text' value={ this.state.numberToAdd } onChange={ this.onChange.bind(this, 'numberToAdd') } />
                            </div>
                            <div className='col-sm-1'>
                                <button className='btn btn-default' onClick={ this.onAddCard }>Add</button>
                            </div>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-sm-2 control-label'>Cards</label>
                        <div className='col-sm-9'>
                            <textarea className='form-control' rows='25' value={ cardList } />
                        </div>
                    </div>
                    <div className='form-group'>
                        <div className='col-sm-offset-2 col-sm-8'>
                            <button ref='submit' type='submit' className='btn btn-primary' onClick={ this.onAddDeck }>Add Deck</button>
                        </div>
                    </div>
                </form>
                <div className='col-sm-6 right-pane'>
                    <h3>{ this.state.deckname }</h3>
                    <div className='decklist'>
                        <img className='pull-left' src={ '/img/factions/' + this.state.faction + '.png' } />
                        { this.state.agenda !== '' ? <img className='pull-right' src={ '/img/cards/' + this.state.agenda + '.png' } /> : null }
                        <div>
                            <h4>{ this.state.factionName }</h4>
                            <div>Agenda: <span onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ this.state.agenda === '' ? 'None' : this.state.agendaName }</span></div>
                            <div>Draw deck: { cardCount } cards</div>
                            <div>Plot deck: { this.state.plotCards.length } cards</div>
                        </div>
                    </div>
                    <h4>Plots</h4>
                    { plotsToRender }
                    { cardsToRender }
                </div>
            </div>);
    }
}

AddDeck.displayName = 'AddDeck';
AddDeck.propTypes = {
    router: React.PropTypes.shape({
        push: React.PropTypes.func.isRequired
    }).isRequired
};

export default withRouter(AddDeck, { withRef: true });
