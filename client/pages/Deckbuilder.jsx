import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../Components/Site/Panel';
import CardImage from '../Components/GameBoard/CardImage';

import * as actions from '../actions';
import { thisExpression } from '@babel/types';
import path from 'path';

export class Deckbuilder extends React.Component {
constructor() {
    super();
    this.cards = [];
    this.displayCards = [];
}

componentDidMount() {
    this.props.loadCards();
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

            </Panel>
        </Panel>
        ); 
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

    selectFunction(id) {
        console.log(id);
    }
}

Deckbuilder.displayName = 'Deckbuilder';
Deckbuilder.propTypes = {
    loadCards: PropTypes.func.isRequired,
    cards: PropTypes.object,
    message: PropTypes.string
};

function mapStateToProps(state) {
    return {
        cards: state.cards.cards
    };
}

export default connect(mapStateToProps, actions)(Deckbuilder);
