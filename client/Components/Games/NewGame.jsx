import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../Site/Panel';
import Checkbox from '../Form/Checkbox';
import AlertPanel from '../Site/AlertPanel';
import * as actions from '../../actions';

const GameNameMaxLength = 64;

class NewGame extends React.Component {
    constructor() {
        super();

        this.onCancelClick = this.onCancelClick.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onSpectatorsClick = this.onSpectatorsClick.bind(this);
        this.onMuteSpectatorsClick = this.onMuteSpectatorsClick.bind(this);
        this.onShowHandClick = this.onShowHandClick.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);

        this.state = {
            spectators: true,
            showHand: false,
            muteSpectators: false,
            selectedGameType: 'casual',
            selectedGameFormat: 'normal',
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
        this.setState({ gameName: event.target.value });
    }

    onPasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    onSpectatorsClick(event) {
        this.setState({ spectators: event.target.checked });
    }

    onShowHandClick(event) {
        this.setState({ showHand: event.target.checked });
    }

    onMuteSpectatorsClick(event) {
        this.setState({ muteSpectators: event.target.checked });
    }

    onSubmitClick(event) {
        event.preventDefault();

        this.props.socket.emit('newgame', {
            name: this.state.gameName,
            spectators: this.state.spectators,
            showHand: this.state.showHand,
            gameType: this.state.selectedGameType,
            gameFormat: this.state.selectedGameFormat,
            password: this.state.password,
            quickJoin: this.props.quickJoin
        });
    }

    onGameTypeChange(gameType) {
        this.setState({ selectedGameType: gameType });
    }

    onGameFormatChange(gameFormat) {
        this.setState({ selectedGameFormat: gameFormat });
    }

    isGameTypeSelected(gameType) {
        return this.state.selectedGameType === gameType;
    }

    isGameFormatSelected(gameFormat) {
        return this.state.selectedGameFormat === gameFormat;
    }

    getOptions() {
        return (<div className='row'>
            <Checkbox name='allowSpectators' noGroup label={ 'Allow spectators' } fieldClass='col-sm-8'
                onChange={ this.onSpectatorsClick } checked={ this.state.spectators } />
            <Checkbox name='showHands' noGroup label={ 'Show hands to spectators' } fieldClass='col-sm-8'
                onChange={ this.onShowHandClick } checked={ this.state.showHand } />
            <Checkbox name='muteSpectators' noGroup label={ 'Mute spectators' } fieldClass='col-sm-8'
                onChange={ this.onMuteSpectatorsClick } checked={ this.state.muteSpectators } />
        </div>);
    }

    getGameTypeOptions() {
        let gameTypes = [
            { name: 'beginner', label: 'Beginner' },
            { name: 'casual', label: 'Casual' },
            { name: 'competitive', label: 'Competitive' }
        ];

        return (
            <div className='row game-type'>
                <div className='col-sm-12'>
                    <b>Game Type</b>
                </div>
                <div className='col-sm-10'>
                    { gameTypes.map(gameType => {
                        return (<label key={ gameType.name } className='radio-inline'>
                            <input type='radio' onChange={ this.onGameTypeChange.bind(this, gameType.name) } checked={ this.isGameTypeSelected(gameType.name) } />
                            { gameType.label }
                        </label>);

                    }) }
                </div>
            </div>);
    }

    getGameFormatOptions() {
        let gameFormats = [
            { name: 'normal', label: 'Normal' },
            { name: 'sealed', label: 'Sealed' }
        ];

        return (
            <div className='row'>
                <div className='col-sm-12'>
                    <b>Game Format</b>
                </div>
                <div className='col-sm-10'>
                    { gameFormats.map(gameFormat => {
                        return (<label key={ gameFormat.name } className='radio-inline'>
                            <input type='radio' onChange={ this.onGameFormatChange.bind(this, gameFormat.name) } checked={ this.isGameFormatSelected(gameFormat.name) } />
                            { gameFormat.label }
                        </label>);

                    }) }
                </div>
            </div>);
    }

    render() {
        let charsLeft = GameNameMaxLength - this.state.gameName.length;
        let content = [];

        if(this.props.quickJoin) {
            content =
                (<div>
                    <AlertPanel type='info' message="Select the type of game you'd like to play and either you'll join the next one available, or one will be created for you with default options." />
                    { this.getGameFormatOptions() }
                    { this.getGameTypeOptions() }
                </div>);
        } else {
            content = (<div>
                <div className='row'>
                    <div className='col-sm-8'>
                        <label htmlFor='gameName'>Name</label>
                        <label className='game-name-char-limit'>{ charsLeft >= 0 ? charsLeft : 0 }</label>
                        <input className='form-control' placeholder='Game Name' type='text' onChange={ this.onNameChange } value={ this.state.gameName } maxLength={ GameNameMaxLength } />
                    </div>
                </div>
                { this.getOptions() }
                { this.getGameFormatOptions() }
                { this.getGameTypeOptions() }
                <div className='row game-password'>
                    <div className='col-sm-8'>
                        <label>Password</label>
                        <input className='form-control' type='password' onChange={ this.onPasswordChange } value={ this.state.password } />
                    </div>
                </div>
            </div>);
        }

        return this.props.socket ? (
            <div>
                <Panel title={ this.props.quickJoin ? 'Join Existing or Start New Game' : 'New game' }>
                    <form className='form'>
                        { content }
                        <div className='button-row'>
                            <button className='btn btn-primary' onClick={ this.onSubmitClick }>Start</button>
                            <button className='btn btn-primary' onClick={ this.onCancelClick }>Cancel</button>
                        </div>
                    </form>
                </Panel >
            </div >) : (
            <div>
                    Connecting to the server, please wait...
            </div>
        );
    }
}

NewGame.displayName = 'NewGame';
NewGame.propTypes = {
    allowMelee: PropTypes.bool,
    cancelNewGame: PropTypes.func,
    defaultGameName: PropTypes.string,
    quickJoin: PropTypes.bool,
    socket: PropTypes.object
};

function mapStateToProps(state) {
    return {
        allowMelee: state.account.user ? state.account.user.permissions.allowMelee : false,
        socket: state.lobby.socket
    };
}

export default connect(mapStateToProps, actions)(NewGame);
