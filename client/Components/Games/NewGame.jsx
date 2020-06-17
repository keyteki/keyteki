import React from 'react';
import { useSelector } from 'react-redux';
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

const GameNameMaxLength = 64;

/**
 * @typedef NewGameProps
 * @property {boolean} quickJoin The new game is quick join
 */
const NewGame = ({ quickJoin }) => {
    const lobbySocket = useSelector((state) => state.lobby.socket);
    const username = useSelector((state) => state.account.user?.username);
    const { t } = useTranslation();

    const schema = yup.object().shape(
        {
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
            gameType: yup.string().required(),
            wc: yup.boolean().when(['aoa', 'cota'], {
                is: (aoa, cota) => {
                    return !aoa && !cota;
                },
                then: yup.boolean().required()
            }),
            aoa: yup.boolean().when(['wc', 'cota'], {
                is: (wc, cota) => {
                    return !wc && !cota;
                },
                then: yup.boolean().required()
            }),
            cota: yup.boolean().when(['aoa', 'wc'], {
                is: (aoa, wc) => {
                    return !aoa && !wc;
                },
                then: yup.boolean().required()
            })
        },
        [
            ['wc', 'aoa'],
            ['wc', 'cota'],
            ['aoa', 'cota']
        ]
    );

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
                onSubmit={(something) => {
                    console.info(something);
                }}
                initialValues={initialValues}
            >
                {(formProps) => (
                    <Form
                        onSubmit={(event) => {
                            event.preventDefault();
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
                                <Col sm={8}>
                                    <label>
                                        <Trans>Password</Trans>
                                    </label>
                                    <input className='form-control' type='password' />
                                </Col>
                            </Row>
                        )}
                        <div className='button-row'>
                            <Button variant='success' onClick={formProps.submitForm}>
                                <Trans>Start</Trans>
                            </Button>
                            <Button variant='primary'>
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
