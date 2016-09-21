import React from 'react';
import {connect} from 'react-redux';

import * as actions from './actions';

class InnerPendingGame extends React.Component {
    constructor() {
        super();

        this.isGameReady = this.isGameReady.bind(this);
    }

    isGameReady() {
        return this.props.currentGame.player1 && this.props.currentGame.player1.deck &&
            this.props.currentGame.player2 && this.props.currentGame.player2.deck;
    }

    render() {
        return (
            <div>
                <div className='button-row'>
                    <button className='btn btn-primary' disabled={ !this.isGameReady() }>Start</button>
                    <button className='btn btn-primary'>Leave</button>
                </div>
                <h3>{ this.props.currentGame.name }</h3>
                <div>Waiting for players...</div>
                <h4>Players</h4>
                <div>{ this.props.currentGame.player1.name }<span className='deck-link'>Select deck...</span></div>
                <div>{ this.props.currentGame.player2 ? this.props.currentGame.player2.name : null }</div>
            </div>);
    }
}

InnerPendingGame.displayName = 'PendingGame';
InnerPendingGame.propTypes = {
    currentGame: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentGame: state.games.currentGame
    };
}

const PendingGame = connect(mapStateToProps, actions)(InnerPendingGame);

export default PendingGame;

