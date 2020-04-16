import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Panel from '../Site/Panel';
import Checkbox from '../Form/Checkbox';
import * as actions from '../../actions';

import { withTranslation, Trans } from 'react-i18next';

class NewTournamentGame extends React.Component {
    constructor() {
        super();

        this.onCancelClick = this.onCancelClick.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onSpectatorsClick = this.onSpectatorsClick.bind(this);
        this.onMuteSpectatorsClick = this.onMuteSpectatorsClick.bind(this);
        this.onShowHandClick = this.onShowHandClick.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onUseGameTimeLimitClick = this.onUseGameTimeLimitClick.bind(this);
        this.onGameTimeLimitChange = this.onGameTimeLimitChange.bind(this);
        this.onHideDecklistsClick = this.onHideDecklistsClick.bind(this);

        this.state = {
            spectators: true,
            showHand: true,
            muteSpectators: false,
            selectedGameFormat: 'normal',
            expansions: { cota: false, aoa: false, wc: true },
            password: '',
            useGameTimeLimit: false,
            hideDecklists: false,
            gameTimeLimit: 35
        };
    }

    componentWillMount() {
        this.setState({ gameName: this.props.defaultGameName });
    }

    onCancelClick(event) {
        event.preventDefault();
        this.props.closeModal();
        this.props.cancelNewGame();
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
        const { getParticipantName } = this.props;
        this.props.openMatches.forEach(match => {
            this.props.socket.emit('newgame', {
                name: `${getParticipantName(match.player1_id)} vs ${getParticipantName(match.player2_id)}`,
                spectators: this.state.spectators,
                showHand: this.state.showHand,
                gameType: 'tournament',
                gameFormat: this.state.selectedGameFormat,
                password: this.state.password,
                muteSpectators: this.state.muteSpectators,
                expansions: this.state.expansions,
                useGameTimeLimit: this.state.useGameTimeLimit,
                gameTimeLimit: this.state.gameTimeLimit,
                hideDecklists: this.state.hideDecklists,
                challonge: {
                    matchId: match.id,
                    tournamentId: this.props.tournament.id
                }
            });
        });
        this.props.closeModal();
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

    onHideDecklistsClick(event) {
        this.setState({ hideDecklists: event.target.checked });
    }

    onGameTimeLimitChange(event) {
        this.setState({ gameTimeLimit: event.target.value });
    }

    isGameFormatSelected(gameFormat) {
        return this.state.selectedGameFormat === gameFormat;
    }

    getOptions() {
        let t = this.props.t;

        return (<div className='row'>
            <Checkbox name='allowSpectators' noGroup label={ t('Allow spectators') } fieldClass='col-sm-8'
                onChange={ this.onSpectatorsClick } checked={ this.state.spectators }/>
            <Checkbox name='showHands' noGroup label={ t('Show hands to spectators') } fieldClass='col-sm-8'
                onChange={ this.onShowHandClick } checked={ this.state.showHand }/>
            <Checkbox name='muteSpectators' noGroup label={ t('Mute spectators') } fieldClass='col-sm-8'
                onChange={ this.onMuteSpectatorsClick } checked={ this.state.muteSpectators }/>
            <Checkbox name='timeLimit' noGroup label={ t('Use a time limit (in minutes)') } fieldClass='col-sm-12'
                onChange={ this.onUseGameTimeLimitClick } checked={ this.state.useGameTimeLimit }/>
            { this.state.useGameTimeLimit && <div className='col-sm-4'>
                <input className='form-control' type='number' onChange={ this.onGameTimeLimitChange } value={ this.state.gameTimeLimit }/>
            </div> }
            <Checkbox name='hideDecklists' noGroup label={ t('Hide opponent decklists') } fieldClass='col-sm-8' onChange={ this.onHideDecklistsClick } checked={ this.state.hideDecklists }/>
        </div>);
    }

    getGameFormatOptions() {
        let t = this.props.t;

        let gameFormats = [
            { name: 'normal', label: t('Normal') },
            { name: 'sealed', label: t('Sealed') },
            { name: 'reversal', label: t('Reversal') },
            { name: 'adaptive-bo1', label: t('Adaptive - Best of 1') }
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
                { this.state.selectedGameFormat === 'sealed' &&
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
        let t = this.props.t;


        return this.props.socket ? (
            <div>
                <Panel title={ t('New game') }>
                    <form className='form'>
                        <div>
                            { this.getOptions() }
                            { this.getGameFormatOptions() }
                            <div className='row game-password'>
                                <div className='col-sm-8'>
                                    <label><Trans>Password</Trans></label>
                                    <input className='form-control' type='password' onChange={ this.onPasswordChange } value={ this.state.password } />
                                </div>
                            </div>
                        </div>
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

NewTournamentGame.displayName = 'NewTournamentGame';
NewTournamentGame.propTypes = {
    allowMelee: PropTypes.bool,
    cancelNewGame: PropTypes.func,
    closeModal: PropTypes.func,
    defaultGameName: PropTypes.string,
    getParticipantName: PropTypes.func,
    i18n: PropTypes.object,
    openMatches: PropTypes.array,
    socket: PropTypes.object,
    t: PropTypes.func,
    tournament: PropTypes.object
};

function mapStateToProps(state) {
    return {
        allowMelee: state.account.user ? state.account.user.permissions.allowMelee : false,
        socket: state.lobby.socket
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(NewTournamentGame));
