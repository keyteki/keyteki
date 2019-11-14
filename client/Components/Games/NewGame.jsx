import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../Site/Panel';
import Checkbox from '../Form/Checkbox';
import AlertPanel from '../Site/AlertPanel';
import * as actions from '../../actions';

import { withTranslation, Trans } from 'react-i18next';

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
        this.onUseGameTimeLimitClick = this.onUseGameTimeLimitClick.bind(this);
        this.onGameTimeLimitChange = this.onGameTimeLimitChange.bind(this);

        this.state = {
            spectators: true,
            showHand: false,
            muteSpectators: false,
            selectedGameType: 'casual',
            selectedGameFormat: 'normal',
            expansions: { cota: false, aoa: false, wc: true },
            password: '',
            useGameTimeLimit: false,
            gameTimeLimit: 35
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
            quickJoin: this.props.quickJoin,
            muteSpectators: this.state.muteSpectators,
            expansions: this.state.expansions,
            useGameTimeLimit: this.state.useGameTimeLimit,
            gameTimeLimit: this.state.gameTimeLimit
        });
    }

    onGameTypeChange(gameType) {
        this.setState({ selectedGameType: gameType });
    }

    onGameFormatChange(gameFormat) {
        this.setState({ selectedGameFormat: gameFormat });
    }

    gameExpansionCheckChange(expansion) {
        let expansions = this.state.expansions;

        expansions[expansion] = !expansions[expansion];

        this.setState({ expansions: expansions });
    }

    onUseGameTimeLimitClick(event) {
        this.setState({ useGameTimeLimit: event.target.checked });
    }

    onGameTimeLimitChange(event) {
        this.setState({ gameTimeLimit: event.target.value });
    }

    isGameTypeSelected(gameType) {
        return this.state.selectedGameType === gameType;
    }

    isGameFormatSelected(gameFormat) {
        return this.state.selectedGameFormat === gameFormat;
    }

    getOptions() {
        let t = this.props.t;

        return (<div className='row'>
            <Checkbox name='allowSpectators' noGroup label={ t('Allow spectators') } fieldClass='col-sm-8'
                onChange={ this.onSpectatorsClick } checked={ this.state.spectators } />
            <Checkbox name='showHands' noGroup label={ t('Show hands to spectators') } fieldClass='col-sm-8'
                onChange={ this.onShowHandClick } checked={ this.state.showHand } />
            <Checkbox name='muteSpectators' noGroup label={ t('Mute spectators') } fieldClass='col-sm-8'
                onChange={ this.onMuteSpectatorsClick } checked={ this.state.muteSpectators } />
            <Checkbox name='timeLimit' noGroup label={ t('Use a time limit (in minutes)') } fieldClass='col-sm-12'
                onChange={ this.onUseGameTimeLimitClick } checked={ this.state.useGameTimeLimit } />
            { this.state.useGameTimeLimit && <div className='col-sm-4'>
                <input className='form-control' type='number' onChange={ this.onGameTimeLimitChange } value={ this.state.gameTimeLimit } />
            </div> }
        </div>);
    }

    getGameTypeOptions() {
        let t = this.props.t;

        let gameTypes = [
            { name: 'beginner', label: t('Beginner') },
            { name: 'casual', label: t('Casual') },
            { name: 'competitive', label: t('Competitive') }
        ];

        return (
            <div className='row game-type'>
                <div className='col-sm-12 game-type'>
                    <b><Trans>Game Type</Trans></b>
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
        let t = this.props.t;

        let gameFormats = [
            { name: 'normal', label: t('Normal') },
            { name: 'sealed', label: t('Sealed') },
            { name: 'reversal', label: t('Reversal') }
        ];

        let expansions = [
            { name: 'cota', label: t('Call of the Archons') },
            { name: 'aoa', label: t('Age of Ascension') },
            { name: 'wc', label: t('Worlds Collide') }
        ];

        return (
            <div className='row'>
                <div className='col-sm-12 game-format'>
                    <b><Trans>Game Format</Trans></b>
                </div>
                <div className='col-sm-10'>
                    { gameFormats.map(gameFormat => {
                        return (<label key={ gameFormat.name } className='radio-inline'>
                            <input type='radio' onChange={ this.onGameFormatChange.bind(this, gameFormat.name) } checked={ this.isGameFormatSelected(gameFormat.name) } />
                            { gameFormat.label }
                        </label>);
                    }) }
                </div>
                { this.state.selectedGameFormat === 'sealed' && !this.props.quickJoin &&
                    <div className='col-sm-12'>
                        {
                            expansions.map(expansion => {
                                return (
                                    <label key={ expansion.name } className='checkbox-inline'><input type='checkbox' onChange={ this.gameExpansionCheckChange.bind(this, expansion.name) } checked={ this.state.expansions[expansion.name] } />
                                        { expansion.label }
                                    </label>);
                            })
                        }
                    </div>
                }
            </div>);
    }

    render() {
        let charsLeft = GameNameMaxLength - this.state.gameName.length;
        let content = [];
        let t = this.props.t;

        if(this.props.quickJoin) {
            content =
                (<div>
                    <AlertPanel type='info' message={ t('Select the type of game you\'d like to play and either you\'ll join the next one available, or one will be created for you with default options.') } />
                    { this.getGameFormatOptions() }
                    { this.getGameTypeOptions() }
                </div>);
        } else {
            content = (<div>
                <div className='row'>
                    <div className='col-sm-8'>
                        <label htmlFor='gameName'><Trans>Name</Trans></label>
                        <label className='game-name-char-limit'>{ charsLeft >= 0 ? charsLeft : 0 }</label>
                        <input className='form-control' placeholder={ t('Game Name') } type='text' onChange={ this.onNameChange } value={ this.state.gameName } maxLength={ GameNameMaxLength } />
                    </div>
                </div>
                { this.getOptions() }
                { this.getGameFormatOptions() }
                { this.getGameTypeOptions() }
                <div className='row game-password'>
                    <div className='col-sm-8'>
                        <label><Trans>Password</Trans></label>
                        <input className='form-control' type='password' onChange={ this.onPasswordChange } value={ this.state.password } />
                    </div>
                </div>
            </div>);
        }

        return this.props.socket ? (
            <div>
                <Panel title={ t(this.props.quickJoin ? 'Join Existing or Start New Game' : 'New game') }>
                    <form className='form'>
                        { content }
                        <div className='button-row'>
                            <button className='btn btn-success' onClick={ this.onSubmitClick }><Trans>Start</Trans></button>
                            <button className='btn btn-primary' onClick={ this.onCancelClick }><Trans>Cancel</Trans></button>
                        </div>
                    </form>
                </Panel >
            </div >) : (
            <div>
                <Trans>Connecting to the server, please wait...</Trans>
            </div>
        );
    }
}

NewGame.displayName = 'NewGame';
NewGame.propTypes = {
    allowMelee: PropTypes.bool,
    cancelNewGame: PropTypes.func,
    defaultGameName: PropTypes.string,
    i18n: PropTypes.object,
    quickJoin: PropTypes.bool,
    socket: PropTypes.object,
    t: PropTypes.func
};

function mapStateToProps(state) {
    return {
        allowMelee: state.account.user ? state.account.user.permissions.allowMelee : false,
        socket: state.lobby.socket
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(NewGame));
