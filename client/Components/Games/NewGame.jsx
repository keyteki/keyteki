import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Trans, useTranslation } from 'react-i18next';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

import Panel from '../Site/Panel';
import AlertPanel from '../Site/AlertPanel';
import GameOptions from './GameOptions';
import GameFormats from './GameFormats';
import GameTypes from './GameTypes';
import { getStandardControlProps } from '../../util';
import { cancelNewGame, sendSocketMessage } from '../../redux/actions';

import './NewGame.scss';

const GameNameMaxLength = 64;

/**
 * @typedef NewGameProps
 * @property {boolean} quickJoin The new game is quick join
 */
const NewGame = ({ quickJoin }) => {
    const lobbySocket = useSelector((state) => state.lobby.socket);
    const username = useSelector((state) => state.account.user?.username);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const schema = yup.object({
        gameName: yup
            .string()
            .required(t('You must specify a name for the game'))
            .max(
                GameNameMaxLength,
                t(`Game name must be less than ${GameNameMaxLength} characters`)
            ),
        password: yup.string().optional(),
        gameTimeLimit: yup
            .number()
            .min(10, t('Games must be at least 10 minutes long'))
            .max(120, t('Games must be less than 2 hours')),
        gameFormat: yup.string().required(),
        gameType: yup.string().required()
    });

    const initialValues = {
        gameName: `${username}'s game`,
        password: '',
        allowSpectators: true,
        gameFormat: 'normal',
        gameType: 'casual',
        gameTimeLimit: 35,
        wc: true
    };

    if (!lobbySocket) {
        return (
            <div>
                <Trans>
                    The connection to the lobby has been lost, waiting for it to be restored. If
                    this message persists, please refresh the page.
                </Trans>
            </div>
        );
    }

    return (
        <Panel title={t(quickJoin ? 'Quick Join' : 'New game')}>
            <Formik
                validationSchema={schema}
                onSubmit={(values) => {
                    dispatch(sendSocketMessage('newgame', values));
                }}
                initialValues={initialValues}
            >
                {(formProps) => (
                    <Form
                        onSubmit={(event) => {
                            event.preventDefault();

                            if (
                                formProps.values.gameFormat === 'sealed' &&
                                !formProps.values.aoa &&
                                !formProps.values.cota &&
                                !formProps.values.wc
                            ) {
                                formProps.setFieldError(
                                    'gameFormat',
                                    t('You must select at least one expansion')
                                );

                                return;
                            }

                            formProps.handleSubmit(event);
                        }}
                    >
                        {quickJoin && (
                            <AlertPanel
                                type='info'
                                message={t(
                                    "Select the type of game you'd like to play and either you'll join the next one available, or one will be created for you with default options."
                                )}
                            />
                        )}
                        {!quickJoin && (
                            <>
                                <Form.Row>
                                    <Form.Group as={Col} lg='8' controlId='formGridGameName'>
                                        <Form.Label>{t('Name')}</Form.Label>
                                        <Form.Label className='float-right'>
                                            {GameNameMaxLength - formProps.values.gameName.length}
                                        </Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder={t('Game Name')}
                                            maxLength={GameNameMaxLength}
                                            {...getStandardControlProps(formProps, 'gameName')}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {formProps.errors.gameName}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <GameOptions formProps={formProps} />
                            </>
                        )}
                        <GameFormats formProps={formProps} />
                        <GameTypes formProps={formProps} />
                        {!quickJoin && (
                            <Row>
                                <Form.Group as={Col} sm={8}>
                                    <Form.Label>{t('Password')}</Form.Label>
                                    <Form.Control
                                        type='password'
                                        placeholder={t('Enter a password')}
                                        {...getStandardControlProps(formProps, 'password')}
                                    />
                                </Form.Group>
                            </Row>
                        )}
                        <div className='text-center newgame-buttons'>
                            <Button variant='success' type='submit'>
                                <Trans>Start</Trans>
                            </Button>
                            <Button variant='primary' onClick={() => dispatch(cancelNewGame())}>
                                <Trans>Cancel</Trans>
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Panel>
    );
};

/*

    onSubmitClick(event) {
        event.preventDefault();


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
