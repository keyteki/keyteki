import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../Components/Site/Panel';
import CardEntry from '../Components/Site/CardEntry';
import CardImage from '../Components/GameBoard/CardImage';

import * as actions from '../actions';

export class Deckbuilder extends React.Component {
    constructor() {
        super();
        this.cards = [];
        this.displayCards = [];
        this.selectedCards = [];
        this.selectedDisplayCards = [];
        this.forcedUpdate = false;
        this.total = 0;

        this.state = {
            deckName: ''
        };
    }

    componentDidMount() {
        this.props.loadCards();
        this.props.createDeckBuilder();

        this.selectFunction = this.selectFunction.bind(this);
        this.saveButtonClicked = this.saveButtonClicked.bind(this);
    }

    componentWillReceiveProps(props) {
        if(this.props.cards) {
            this.cards = Object.values(this.props.cards);
        }
    }

    render() {
        return (
            <Panel title={'Deckbuilder'}>
                <Panel title={'Available Cards'} className='deckbuilder-container available-cards-panel'>
                    {this.getCards()}
                </Panel>
                <Panel title={'Selected Cards'} className='deckbuilder-container selected-cards-panel'>
                    {this.getSelectedCards()}
                </Panel>
                <button disabled={ this.total <= 35 || this.total >= 45 } onClick={this.saveButtonClicked}>Save</button>
            </Panel>
        );
    }

    saveButtonClicked() {
        this.props.getBuilderDeck((response) => {
            this.props.saveBuilderDeck((res) => {
                if(res.success) {
                    this.selectedDisplayCards = [];
                    this.selectedCards = [];
                    this.total = 0;
                    this.forceUpdate();
                    this.forcedUpdate = true;
                }
            });
        });
    }


    getCards() {
        if(this.cards.length !== this.displayCards.length) {
            this.displayCards = [];
            for(var i = 0; i < this.cards.length; i++) {
                this.displayCards.push(
                    <CardImage isDeckbuilder={ true } img={ this.cards[i].image } key={ i }
                               selectFunction={ this.selectFunction } id={ this.cards[i].id }/>
                );
            }
        }

        return <div>{ this.displayCards }</div>;
    }

    getSelectedCards() {
        if(this.selectedCards.length !== this.selectedDisplayCards.length || this.forcedUpdate) {
            this.selectedDisplayCards = [];
            this.selectedCards.forEach((selectedCard, i) => {
                let card = this.cards.find(card => card.id === selectedCard.id);

                if(card && selectedCard.count) {
                    this.selectedDisplayCards.push(
                        <CardEntry key={ i } cardName={ card.name } count={ selectedCard.count }/>
                    );
                }
            });
        }

        return <div>{ this.selectedDisplayCards }</div>;
    }

    selectFunction(id) {
        this.props.addCardToBuilder(id,
            (response) => {
                if(response.success) {
                    this.selectedCards = response.buildingDeck.cards;
                    this.total = response.buildingDeck.total;
                    this.forceUpdate();
                    this.forcedUpdate = true;
                }
            });

    }
}

Deckbuilder.displayName = 'Deckbuilder';
Deckbuilder.propTypes = {
    addCardToBuilder: PropTypes.func.isRequired,
    cards: PropTypes.object,
    createDeckBuilder: PropTypes.func.isRequired,
    getBuilderDeck: PropTypes.func.isRequired,
    loadCards: PropTypes.func.isRequired,
    message: PropTypes.string,
    saveDeck: PropTypes.func.isRequired,
    selectedCards: PropTypes.array
};

function mapStateToProps(state) {
    return {
        cards: state.cards.cards,
        selectedCards: state.deckbuilder.selectedCards
    };
}

export default connect(mapStateToProps, actions)(Deckbuilder);
