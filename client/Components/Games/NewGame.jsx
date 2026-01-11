import { Formik } from 'formik';
import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { cancelNewGame, sendSocketMessage } from '../../redux/actions';
import { getStandardControlProps } from '../../util';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import GameFormats from './GameFormats';
import GameOptions from './GameOptions';
import GamePlaystyles from './GamePlaystyles';
import GameSets from './GameSets';

import './NewGame.scss';

const GameNameMaxLength = 64;

/**
 * @typedef NewGameProps
 * @property {boolean} [quickJoin] The new game is quick join
 * @property {any} [tournament] Whether or not we're operating under the tournament UI
 * @property {import("../../typedefs").GamePlaystyle} [defaultGamePlaystyle] The default game type to use
 * @property {number} [defaultTimeLimit] The default time limit to use
 * @property {boolean} [defaultPrivate] Whether or not the game defaults to private
 * @property {function(string): string} [getParticipantName] A function to get the participant name of a participant in a tournament
 * @property {any[]} [matches] A list of tournament matches
 * @property {function(boolean): void} [onClosed] A callback to be called when the window is closed
 */

/**
 * @param {NewGameProps} props
 */
const NewGame = ({
    quickJoin,
    tournament,
    defaultGamePlaystyle,
    defaultPrivate,
    defaultTimeLimit,
    getParticipantName,
    matches,
    onClosed
}) => {
    const lobbySocket = useSelector((state) => state.lobby.socket);
    const username = useSelector((state) => state.account.user?.username);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const schema = yup.object({
        name: yup
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
        gamePlaystyle: yup.string().required()
    });

    const initialValues = {
        name: `${username}'s game`,
        password: '',
        allowSpectators: true,
        gameFormat: 'archon',
        gamePlaystyle: defaultGamePlaystyle || 'casual',
        useGameTimeLimit: !!defaultTimeLimit,
        gameTimeLimit: defaultTimeLimit || 45,
        gamePrivate: defaultPrivate,
        pv: true
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
                    if (tournament) {
                        for (let match of matches) {
                            dispatch(
                                sendSocketMessage('newgame', {
                                    ...values,
                                    expansions: {
                                        aoa: values.aoa,
                                        cota: values.cota,
                                        wc: values.wc,
                                        mm: values.mm,
                                        dt: values.dt,
                                        woe: values.woe,
                                        gr: values.gr,
                                        as: values.as,
                                        toc: values.toc,
                                        momu: values.momu,
                                        disc: values.disc,
                                        vm2023: values.vm2023,
                                        vm2024: values.vm2024,
                                        vm2025: values.vm2025,
                                        pv: values.pv,
                                        cc: values.cc
                                    },
                                    name: `${getParticipantName(
                                        match.player1_id
                                    )} vs ${getParticipantName(match.player2_id)}`,
                                    challonge: { matchId: match.id, tournamentId: tournament.id },
                                    tournament: true
                                })
                            );

                            onClosed(true);
                        }
                    } else {
                        values.expansions = {
                            aoa: values.aoa,
                            as: values.as,
                            cc: values.cc,
                            cota: values.cota,
                            disc: values.disc,
                            dt: values.dt,
                            gr: values.gr,
                            mm: values.mm,
                            momu: values.momu,
                            pv: values.pv,
                            toc: values.toc,
                            vm2023: values.vm2023,
                            vm2024: values.vm2024,
                            vm2025: values.vm2025,
                            wc: values.wc,
                            woe: values.woe
                        };
                        values.quickJoin = quickJoin;

                        dispatch(sendSocketMessage('newgame', values));
                    }
                }}
                initialValues={initialValues}
            >
                {(formProps) => (
                    <Form
                        onSubmit={(event) => {
                            event.preventDefault();

                            if (
                                !formProps.values.aoa &&
                                !formProps.values.as &&
                                !formProps.values.cc &&
                                !formProps.values.cota &&
                                !formProps.values.disc &&
                                !formProps.values.dt &&
                                !formProps.values.gr &&
                                !formProps.values.mm &&
                                !formProps.values.momu &&
                                !formProps.values.pv &&
                                !formProps.values.toc &&
                                !formProps.values.vm2023 &&
                                !formProps.values.vm2024 &&
                                !formProps.values.vm2025 &&
                                !formProps.values.wc &&
                                !formProps.values.woe
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
                                {!tournament && (
                                    <Form.Row>
                                        <Form.Group as={Col} lg='12' controlId='formGridGameName'>
                                            <Form.Label>{t('Name')}</Form.Label>
                                            <Form.Label className='float-right'>
                                                {GameNameMaxLength - formProps.values.name.length}
                                            </Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder={t('Game Name')}
                                                maxLength={GameNameMaxLength}
                                                {...getStandardControlProps(formProps, 'name')}
                                            />
                                            <Form.Control.Feedback type='invalid'>
                                                {formProps.errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>
                                )}
                            </>
                        )}
                        {!tournament && <GamePlaystyles formProps={formProps} />}
                        <GameFormats formProps={formProps} />
                        <GameSets formProps={formProps} />
                        {!quickJoin && (
                            <>
                                <GameOptions formProps={formProps} />
                            </>
                        )}
                        {!quickJoin && (
                            <Row>
                                <Form.Group as={Col} sm={12}>
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
                            <Button
                                variant='primary'
                                onClick={() => {
                                    dispatch(cancelNewGame());
                                    if (onClosed) {
                                        onClosed(false);
                                    }
                                }}
                            >
                                <Trans>Cancel</Trans>
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Panel>
    );
};

NewGame.displayName = 'NewGame';
export default NewGame;
