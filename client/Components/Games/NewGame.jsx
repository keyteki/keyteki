import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation, Trans, useTranslation } from 'react-i18next';

import Panel from '../Site/Panel';
import Checkbox from '../Form/Checkbox';
import AlertPanel from '../Site/AlertPanel';
import * as actions from '../../redux/actions';
import { Form, Button } from 'react-bootstrap';

const GameNameMaxLength = 64;

/**
 * @typedef NewGameProps
 * @property {boolean} quickJoin The new game is quick join
 */
const NewGame = (quickJoin) => {
    const lobbySocket = useSelector((state) => state.lobby.socket);
    const { t } = useTranslation();

    if (!lobbySocket) {
        return (
            <div>
                <Trans>
                    The connection to the lobby has been lost, waiting for it to be restored
                </Trans>
            </div>
        );
    }

    return (
        <Panel title={t(quickJoin ? 'Join Existing or Start New Game' : 'New game')}>
            <Form>
                <div className='button-row'>
                    <Button variant='success'>
                        <Trans>Start</Trans>
                    </Button>
                    <Button variant='primary'>
                        <Trans>Cancel</Trans>
                    </Button>
                </div>
            </Form>
        </Panel>
    );
};

/*
class NewGame extends React.Component {
    constructor(props) {
        super(props);

        this.onCancelClick = this.onCancelClick.bind(this);
        this.onGamePrivateClick = this.onGamePrivateClick.bind(this);
        this.onGameTimeLimitChange = this.onGameTimeLimitChange.bind(this);
        this.onHideDecklistsClick = this.onHideDecklistsClick.bind(this);
        this.onMuteSpectatorsClick = this.onMuteSpectatorsClick.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onShowHandClick = this.onShowHandClick.bind(this);
        this.onSpectatorsClick = this.onSpectatorsClick.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onUseGameTimeLimitClick = this.onUseGameTimeLimitClick.bind(this);

        this.state = {
            expansions: { cota: false, aoa: false, wc: true },
            gameName: 'some game or other', // this.props.defaultGameName,
            gamePrivate: this.props.gamePrivate,
            gameTimeLimit: 35,
            hideDecklists: false,
            muteSpectators: this.props.muteSpectators,
            password: '',
            selectedGameFormat: 'normal',
            selectedGameType: this.props.defaultGameType ? this.props.defaultGameType : 'casual',
            showHand: this.props.showHand,
            spectators: true,
            useGameTimeLimit: this.props.gameTimeLimit
        };
    }

    onCancelClick(event) {
        event.preventDefault();
        this.props.cancelNewGame();
        if (this.props.tournament) {
            this.props.closeModal();
        }
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

        let expansionsSelected = 0;

        for (const value of Object.values(this.state.expansions)) {
            if (value) {
                expansionsSelected++;
            }
        }

        if (this.state.selectedGameFormat === 'sealed' && expansionsSelected === 0) {
            toastr.error(this.props.t('Please select at least one expansion!'));
            return;
        }

        let newGame = {
            expansions: this.state.expansions,
            gameFormat: this.state.selectedGameFormat,
            gamePrivate: this.state.gamePrivate,
            gameTimeLimit: this.state.gameTimeLimit,
            gameType: this.state.selectedGameType,
            hideDecklists: this.state.hideDecklists,
            muteSpectators: this.state.muteSpectators,
            name: this.state.gameName,
            password: this.state.password,
            quickJoin: this.props.quickJoin,
            showHand: this.state.showHand,
            spectators: this.state.spectators,
            useGameTimeLimit: this.state.useGameTimeLimit
        };

        if (this.props.tournament) {
            for (let match of this.props.matches) {
                this.props.socket.emit('newgame', {
                    ...newGame,
                    name: `${this.props.getParticipantName(
                        match.player1_id
                    )} vs ${this.props.getParticipantName(match.player2_id)}`,
                    challonge: { matchId: match.id, tournamentId: this.props.tournament.id },
                    tournament: true
                });
            }

            this.props.closeModal();
        } else {
            this.props.socket.emit('newgame', newGame);
        }
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

    onHideDecklistsClick(event) {
        this.setState({ hideDecklists: event.target.checked });
    }

    onGameTimeLimitChange(event) {
        this.setState({ gameTimeLimit: event.target.value });
    }

    onGamePrivateClick(event) {
        this.setState({ gamePrivate: event.target.checked });
    }

    isGameTypeSelected(gameType) {
        return this.state.selectedGameType === gameType;
    }

    isGameFormatSelected(gameFormat) {
        return this.state.selectedGameFormat === gameFormat;
    }

    getOptions() {
        let t = this.props.t;

        return (
            <div className='row'>
                <Checkbox
                    name='allowSpectators'
                    noGroup
                    label={t('Allow spectators')}
                    fieldClass='col-sm-8'
                    onChange={this.onSpectatorsClick}
                    checked={this.state.spectators}
                />
                <Checkbox
                    name='showHands'
                    noGroup
                    label={t('Show hands to spectators')}
                    fieldClass='col-sm-8'
                    onChange={this.onShowHandClick}
                    checked={this.state.showHand}
                />
                <Checkbox
                    name='muteSpectators'
                    noGroup
                    label={t('Mute spectators')}
                    fieldClass='col-sm-8'
                    onChange={this.onMuteSpectatorsClick}
                    checked={this.state.muteSpectators}
                />
                <Checkbox
                    name='timeLimit'
                    noGroup
                    label={t('Use a time limit (in minutes)')}
                    fieldClass='col-sm-12'
                    onChange={this.onUseGameTimeLimitClick}
                    checked={this.state.useGameTimeLimit}
                />
                <Checkbox
                    name='gamePrivate'
                    noGroup
                    label={t('Private game (Requires game link to join)')}
                    fieldClass='col-sm-12'
                    onChange={this.onGamePrivateClick}
                    checked={this.state.gamePrivate}
                />
                {this.state.useGameTimeLimit && (
                    <div className='col-sm-4'>
                        <input
                            className='form-control'
                            type='number'
                            onChange={this.onGameTimeLimitChange}
                            value={this.state.gameTimeLimit}
                        />
                    </div>
                )}
                <Checkbox
                    name='hideDecklists'
                    noGroup
                    label={t('Hide opponent decklists')}
                    fieldClass='col-sm-8'
                    onChange={this.onHideDecklistsClick}
                    checked={this.state.hideDecklists}
                />
            </div>
        );
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
                    <b>
                        <Trans>Game Type</Trans>
                    </b>
                </div>
                <div className='col-sm-10'>
                    {gameTypes.map((gameType) => {
                        return (
                            <label key={gameType.name} className='radio-inline'>
                                <input
                                    type='radio'
                                    onChange={this.onGameTypeChange.bind(this, gameType.name)}
                                    checked={this.isGameTypeSelected(gameType.name)}
                                />
                                {gameType.label}
                            </label>
                        );
                    })}
                </div>
            </div>
        );
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
                    <b>
                        <Trans>Game Format</Trans>
                    </b>
                </div>
                <div className='col-sm-10'>
                    {gameFormats.map((gameFormat) => {
                        return (
                            <label key={gameFormat.name} className='radio-inline'>
                                <input
                                    type='radio'
                                    onChange={this.onGameFormatChange.bind(this, gameFormat.name)}
                                    checked={this.isGameFormatSelected(gameFormat.name)}
                                />
                                {gameFormat.label}
                            </label>
                        );
                    })}
                </div>
                {this.state.selectedGameFormat === 'sealed' && !this.props.quickJoin && (
                    <div className='col-sm-12'>
                        {expansions.map((expansion) => {
                            return (
                                <label key={expansion.name} className='checkbox-inline'>
                                    <input
                                        type='checkbox'
                                        onChange={this.gameExpansionCheckChange.bind(
                                            this,
                                            expansion.name
                                        )}
                                        checked={this.state.expansions[expansion.name]}
                                    />
                                    {expansion.label}
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    render() {
        let charsLeft = GameNameMaxLength - this.state.gameName.length;
        let content = [];
        let t = this.props.t;

        if (this.props.quickJoin) {
            content = (
                <div>
                    <AlertPanel
                        type='info'
                        message={t(
                            "Select the type of game you'd like to play and either you'll join the next one available, or one will be created for you with default options."
                        )}
                    />
                    {this.getGameFormatOptions()}
                    {this.getGameTypeOptions()}
                </div>
            );
        } else if (this.props.tournament) {
            content = (
                <div>
                    {this.getOptions()}
                    {this.getGameFormatOptions()}
                    <div className='row game-password'>
                        <div className='col-sm-8'>
                            <label>
                                <Trans>Password</Trans>
                            </label>
                            <input
                                className='form-control'
                                type='password'
                                onChange={this.onPasswordChange}
                                value={this.state.password}
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            content = (
                <div>
                    <div className='row'>
                        <div className='col-sm-8'>
                            <label htmlFor='gameName'>
                                <Trans>Name</Trans>
                            </label>
                            <label className='game-name-char-limit'>
                                {charsLeft >= 0 ? charsLeft : 0}
                            </label>
                            <input
                                className='form-control'
                                placeholder={t('Game Name')}
                                type='text'
                                onChange={this.onNameChange}
                                value={this.state.gameName}
                                maxLength={GameNameMaxLength}
                            />
                        </div>
                    </div>
                    {this.getOptions()}
                    {this.getGameFormatOptions()}
                    {this.getGameTypeOptions()}
                    <div className='row game-password'>
                        <div className='col-sm-8'>
                            <label>
                                <Trans>Password</Trans>
                            </label>
                            <input
                                className='form-control'
                                type='password'
                                onChange={this.onPasswordChange}
                                value={this.state.password}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    }
}

*/

NewGame.displayName = 'NewGame';
export default NewGame;
