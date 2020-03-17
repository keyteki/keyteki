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

    this.state = {
        deckName: ''
    }
}

componentDidMount() {
    this.props.loadCards();
    this.props.createDeckBuilder();
    
    this.selectFunction = this.selectFunction.bind(this);
    this.saveButtonClicked = this.saveButtonClicked.bind(this);
}

componentWillReceiveProps(props) {
    if (this.props.cards) {
        this.cards = Object.values(this.props.cards);
    }
}

render() {
    return (
        <Panel title={ 'Deckbuilder' }>
            <Panel title={'Available Cards'} className='deckbuilder-container available-cards-panel'>
                {this.getCards()}
            </Panel>
            <Panel title={'Selected Cards'} className='deckbuilder-container selected-cards-panel'>
                {this.getSelectedCards()}
            </Panel>
            <button onClick={this.saveButtonClicked}>Save</button>
        </Panel>
        ); 
 }

 saveButtonClicked() {
    this.props.getBuilderDeck((response) => {
        this.props.saveBuilderDeck();
    });
 }


    getCards() {
        if (this.cards.length != this.displayCards.length) {
            this.displayCards = [];
            for (var i = 0; i < this.cards.length; i++) {
                this.displayCards.push(
                    <CardImage isDeckbuilder={true} img={this.cards[i].image} key={i} selectFunction={this.selectFunction} id={this.cards[i].id}/> 
                );
            }
        }

        return <div>{this.displayCards}</div>
    }

    getSelectedCards() {
        if (this.selectedCards.length != this.selectedDisplayCards.length || this.forcedUpdate) {
            this.selectedDisplayCards = [];
            for (var i = 0; i < this.selectedCards.length; i++) {
                var card = this.cards.find(card => card.id == this.selectedCards[i].id);
                if (!card) {
                    continue;
                }
                this.selectedDisplayCards.push(
                    <CardEntry key={i} cardName={card.name} count={this.selectedCards[i].count}/>
                );
            }
        }

        return <div>{this.selectedDisplayCards}</div>
    }

    selectFunction(id) {
        this.props.addCardToBuilder(id,
            (response) => {
                if (response.success) {
                    this.selectedCards = response.selectedCards;
                    this.forceUpdate();
                    this.forcedUpdate = true;
                }
            });

    }
}

Deckbuilder.displayName = 'Deckbuilder';
Deckbuilder.propTypes = {
    loadCards: PropTypes.func.isRequired,
    createDeckBuilder: PropTypes.func.isRequired,
    addCardToBuilder: PropTypes.func.isRequired,
    getBuilderDeck: PropTypes.func.isRequired,
    saveDeck: PropTypes.func.isRequired,
    selectedCards: PropTypes.array,
    cards: PropTypes.object,
    message: PropTypes.string
};

function mapStateToProps(state) {
    return {
        cards: state.cards.cards,
        selectedCards: state.deckbuilder.selectedCards
    };
}

export default connect(mapStateToProps, actions)(Deckbuilder);
