import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import Button from '../HeroUI/Button';
import { Input } from '@heroui/react';
import { Formik } from 'formik';
import * as yup from 'yup';

import Panel from '../Site/Panel';
import AlertPanel from '../Site/AlertPanel';
import GameOptions from './GameOptions';
import GameFormats from './GameFormats';
import GameTypes from './GameTypes';
import { cancelNewGame, sendSocketMessage } from '../../redux/actions';

const GameNameMaxLength = 64;

/**
 * @typedef NewGameProps
 * @property {boolean} [quickJoin] The new game is quick join
 * @property {any} [tournament] Whether or not we're operating under the tournament UI
 * @property {import("../../typedefs").GameType} [defaultGameType] The default game type to use
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
    defaultGameType,
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
        gameType: yup.string().required()
    });

    const initialValues = {
        name: `${username}'s game`,
        password: '',
        allowSpectators: true,
        gameFormat: 'normal',
        gameType: defaultGameType || 'casual',
        useGameTimeLimit: !!defaultTimeLimit,
        gameTimeLimit: defaultTimeLimit || 45,
        gamePrivate: defaultPrivate,
        as: true
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
                                        as: values.as
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
                            cota: values.cota,
                            wc: values.wc,
                            mm: values.mm,
                            dt: values.dt,
                            woe: values.woe,
                            gr: values.gr,
                            as: values.as
                        };
                        values.quickJoin = quickJoin;

                        dispatch(sendSocketMessage('newgame', values));
                    }
                }}
                initialValues={initialValues}
            >
                {(formProps) => (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();

                            if (
                                formProps.values.gameFormat === 'sealed' &&
                                !formProps.values.aoa &&
                                !formProps.values.cota &&
                                !formProps.values.wc &&
                                !formProps.values.mm &&
                                !formProps.values.dt &&
                                !formProps.values.woe &&
                                !formProps.values.gr &&
                                !formProps.values.as
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
                                    <div className='max-w-2xl'>
                                        <div className='flex items-center justify-between mb-1'>
                                            <label className='text-sm font-medium'>
                                                {t('Name')}
                                            </label>
                                            <span className='text-xs text-foreground-500'>
                                                {GameNameMaxLength - formProps.values.name.length}
                                            </span>
                                        </div>
                                        <Input
                                            type='text'
                                            placeholder={t('Game Name')}
                                            maxLength={GameNameMaxLength}
                                            value={formProps.values.name}
                                            onChange={(e) =>
                                                formProps.setFieldValue('name', e.target.value)
                                            }
                                            isInvalid={!!formProps.errors.name}
                                            errorMessage={formProps.errors.name}
                                        />
                                    </div>
                                )}
                                <GameOptions formProps={formProps} />
                            </>
                        )}
                        <GameFormats formProps={formProps} />
                        {!tournament && <GameTypes formProps={formProps} />}
                        {!quickJoin && (
                            <div className='max-w-xl mt-4'>
                                <Input
                                    type='password'
                                    label={t('Password')}
                                    placeholder={t('Enter a password')}
                                    value={formProps.values.password}
                                    onChange={(e) =>
                                        formProps.setFieldValue('password', e.target.value)
                                    }
                                />
                            </div>
                        )}
                        <div className='text-center newgame-buttons'>
                            <Button color='success' type='submit'>
                                <Trans>Start</Trans>
                            </Button>
                            <Button
                                color='primary'
                                onPress={() => {
                                    dispatch(cancelNewGame());
                                    if (onClosed) {
                                        onClosed(false);
                                    }
                                }}
                            >
                                <Trans>Cancel</Trans>
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </Panel>
    );
};

NewGame.displayName = 'NewGame';
export default NewGame;
