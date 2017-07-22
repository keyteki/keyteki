import React from 'react';
import {connect} from 'react-redux';

import * as actions from './actions';

class InnerNewGame extends React.Component {
    constructor() {
        super();

        this.onCancelClick = this.onCancelClick.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onSpecatorsClick = this.onSpecatorsClick.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);

        this.state = {
            spectators: true,
            selectedGameType: 'casual',
            password: ''
        };
    }

    componentWillMount() {
        this.setState({ gameName: this.props.defaultGameName });
    }

    onCancelClick(event) {
        event.preventDefault();

        this.props.cancelNewGame();
    }

    onNameChange(event) {
        this.setState({ gameName: event.target.value.substr(0, 140) });
    }

    onPasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    onSpecatorsClick(event) {
        this.setState({ spectators: event.target.checked });
    }

    onSubmitClick(event) {
        event.preventDefault();

        this.props.socket.emit('newgame', {
            name: this.state.gameName,
            spectators: this.state.spectators,
            gameType: this.state.selectedGameType,
            password: this.state.password
        });
    }

    onRadioChange(gameType) {
        this.setState({ selectedGameType: gameType });
    }

    isGameTypeSelected(gameType) {
        return this.state.selectedGameType === gameType;
    }

    render() {
        let charsLeft = 140 - this.state.gameName.length;
        return this.props.socket ? (
            <div>
                <form className='form'>
                    <div className='row'>
                        <div className='col-sm-5'>
                            <label htmlFor='gameName'>Name</label>
                            <label className='game-name-char-limit'>{ charsLeft >= 0 ? charsLeft : 0 }</label>
                            <input className='form-control' placeholder='Game Name' type='text' onChange={ this.onNameChange } value={ this.state.gameName }/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='checkbox col-sm-5'>
                            <label>
                                <input type='checkbox' onChange={ this.onSpecatorsClick } checked={ this.state.spectators } />
                                Allow spectators
                            </label>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-sm-12'>
                            <b>Game Type</b>
                        </div>
                        <div className='col-sm-9'>
                            <label className='radio-inline'>
                                <input type='radio' onChange={ this.onRadioChange.bind(this, 'beginner') } checked={ this.isGameTypeSelected('beginner') } />
                                Beginner
                            </label>
                            <label className='radio-inline'>
                                <input type='radio' onChange={ this.onRadioChange.bind(this, 'casual') } checked={ this.isGameTypeSelected('casual') } />
                                Casual
                            </label>
                            <label className='radio-inline'>
                                <input type='radio' onChange={ this.onRadioChange.bind(this, 'competitive') } checked={ this.isGameTypeSelected('competitive') } />
                                Competitive
                            </label>
                        </div>
                    </div>
                    <div className='row game-password'>
                        <div className='col-sm-5'>
                            <label>Password</label>
                            <input className='form-control' type='password' onChange={ this.onPasswordChange } value={ this.state.password }/>
                        </div>
                    </div>
                    <div className='button-row'>
                        <button className='btn btn-primary' onClick={ this.onSubmitClick }>Submit</button>
                        <button className='btn btn-primary' onClick={ this.onCancelClick }>Cancel</button>
                    </div>
                </form>
            </div>) : (
            <div>
                    Connecting to the server, please wait...
            </div>
        );
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

