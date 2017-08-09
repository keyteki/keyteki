import React from 'react';
import { connect } from 'react-redux';

import AlertPanel from './SiteComponents/AlertPanel.jsx';
import * as actions from './actions';

class InnerPasswordGame extends React.Component {
    constructor() {
        super();

        this.state = {
            password: ''
        };
    }

    onJoinClick(event) {
        event.preventDefault();

        if(this.props.passwordJoinType === 'Join') {
            this.props.socket.emit('joingame', this.props.passwordGame.id, this.state.password);
        } else if(this.props.passwordJoinType === 'Watch') {
            this.props.socket.emit('watchgame', this.props.passwordGame.id, this.state.password);
        }
    }

    onCancelClick(event) {
        this.props.cancelPasswordJoin();

        event.preventDefault();
    }

    onPasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    render() {
        if(!this.props.passwordGame) {
            return null;
        }

        return (
            <div>
                <div className='col-sm-12'>
                    <h3>Enter the password for { this.props.passwordGame.name }</h3>
                </div>
                <div className='col-sm-5 game-password'>
                    <input className='form-control' type='password' onChange={ this.onPasswordChange.bind(this) } value={ this.state.password }/>
                </div>
                <div className='row' />
                { this.props.passwordError ?
                    <div className='col-sm-6'>
                        <AlertPanel type='error' message={ this.props.passwordError } />
                    </div>
                    : null }    
                <div className='col-sm-12'>
                    <div className='btn-group'>
                        <button className='btn btn-primary' onClick={ this.onJoinClick.bind(this) }>{ this.props.passwordJoinType }</button>
                        <button className='btn btn-primary' onClick={ this.onCancelClick.bind(this) }>Cancel</button>
                    </div>
                </div>    
            </div>);
    }
}

InnerPasswordGame.displayName = 'PasswordGame';
InnerPasswordGame.propTypes = {
    cancelPasswordJoin: React.PropTypes.func,
    passwordError: React.PropTypes.string,
    passwordGame: React.PropTypes.object,
    passwordJoinType: React.PropTypes.string,
    socket: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        passwordError: state.games.passwordError,
        passwordGame: state.games.passwordGame,
        passwordJoinType: state.games.passwordJoinType,
        socket: state.socket.socket
    };
}

const PasswordGame = connect(mapStateToProps, actions)(InnerPasswordGame);

export default PasswordGame;

