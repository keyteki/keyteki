import React from 'react';
import {connect} from 'react-redux';

import * as actions from './actions';

class InnerNewGame extends React.Component {
    constructor() {
        super();

        this.onCancelClick = this.onCancelClick.bind(this);
        this.onGameNameChange = this.onGameNameChange.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
    }

    componentWillMount() {
        this.setState({ gameName: this.props.defaultGameName });
    }

    onCancelClick(event) {
        event.preventDefault();

        this.props.cancelNewGame();
    }

    onGameNameChange(event) {
        this.setState({ gameName: event.target.value });
    }

    onSubmitClick(event) {
        event.preventDefault();

        this.props.socket.emit('newgame', { name: this.state.gameName });
    }

    render() {
        return (
            <div>
                <form className='form'>
                    <div className='form-group col-sm-6'>
                        <label htmlFor='gameName'>Name</label>
                        <input className='form-control' type='text' id='gameName' onChange={ this.onGameNameChange } value={ this.state.gameName } />
                        <div className='button-row'>
                            <button className='btn btn-primary' onClick={ this.onSubmitClick }>Submit</button>
                            <button className='btn btn-primary' onClick={ this.onCancelClick }>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>);
    }
}

InnerNewGame.displayName = 'NewGame';
InnerNewGame.propTypes = {
    cancelNewGame: React.PropTypes.func,
    defaultGameName: React.PropTypes.string,
    socket: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket
    };
}

const NewGame = connect(mapStateToProps, actions)(InnerNewGame);

export default NewGame;

