import React from 'react';
import {connect} from 'react-redux';

import * as actions from './actions';

class InnerGameBoard extends React.Component {
    render() {
        return (
            <div>
                Game goes here
            </div>);
    }
}

InnerGameBoard.displayName = 'GameBoard';
InnerGameBoard.propTypes = {
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket
    };
}

const GameBoard = connect(mapStateToProps, actions)(InnerGameBoard);

export default GameBoard;

