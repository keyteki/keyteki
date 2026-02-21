import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Input } from '@heroui/react';

import Panel from '../Site/Panel';
import GameOptions from './GameOptions';
import GameFormats from './GameFormats';
import GameTypes from './GameTypes';
import { lobbyActions } from '../../redux/slices/lobbySlice';
import { lobbySendMessage } from '../../redux/socketActions';

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
    const currentGameId = useSelector((state) => state.lobby.currentGame?.id);
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
        requirePassword: false,
        allowSpectators: true,
        gameFormat: 'normal',
        gameType: defaultGameType || 'casual',
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
        <Panel
            className='border-border/70 !bg-surface'
            title={t(quickJoin ? 'Quick Join' : 'New game')}
            titleClass='text-base font-semibold tracking-wide'
        >
            <Formik
                validationSchema={schema}
                onSubmit={(values) => {
                    const baseValues = {
                        ...values,
                        password: values.requirePassword ? values.password : ''
                    };
                    const expansions = {
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

                    if (tournament) {
                        for (const match of matches) {
                            dispatch(
                                lobbySendMessage('newgame', {
                                    ...baseValues,
                                    expansions,
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
                        dispatch(
                            lobbySendMessage('newgame', {
                                ...baseValues,
                                expansions,
                                quickJoin
                            })
                        );
                    }
                }}
                initialValues={initialValues}
            >
                {(formProps) => (
                    <form
                        className='[--accent:color-mix(in_oklab,var(--brand)_90%,white)]'
                        onSubmit={(event) => {
                            event.preventDefault();
                            const wrapper = document.querySelector('.wrapper');
                            if (wrapper && typeof wrapper.scrollTo === 'function') {
                                wrapper.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }

                            if (
                                formProps.values.gameFormat === 'sealed' &&
                                !formProps.values.aoa &&
                                !formProps.values.cota &&
                                !formProps.values.wc &&
                                !formProps.values.mm &&
                                !formProps.values.dt &&
                                !formProps.values.woe &&
                                !formProps.values.gr &&
                                !formProps.values.as &&
                                !formProps.values.toc &&
                                !formProps.values.momu &&
                                !formProps.values.disc &&
                                !formProps.values.vm2023 &&
                                !formProps.values.vm2024 &&
                                !formProps.values.vm2025 &&
                                !formProps.values.pv &&
                                !formProps.values.cc
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
                            <div className='rounded-md border border-border/45 bg-surface-secondary/32 px-3 py-1.5 text-xs text-muted'>
                                <Trans>
                                    Choose a game mode and type. We&apos;ll match you to an open
                                    game or create one with default options.
                                </Trans>
                            </div>
                        )}

                        {!quickJoin && (
                            <>
                                {!tournament && (
                                    <div className='max-w-xl'>
                                        <div className='mb-1 flex items-center justify-between'>
                                            <label
                                                htmlFor='name'
                                                className='block text-sm text-foreground/90'
                                            >
                                                {t('Name')}
                                            </label>
                                            <span className='text-xs text-muted'>
                                                {GameNameMaxLength - formProps.values.name.length}
                                            </span>
                                        </div>
                                        <Input
                                            className='w-full [&_[data-slot="input"]]:!text-foreground [&_[data-slot="input"]]:placeholder:!text-foreground/52 [&_[data-slot="input-wrapper"]]:!border [&_[data-slot="input-wrapper"]]:!border-black/20 [&_[data-slot="input-wrapper"]]:!bg-white [&_[data-slot="input-wrapper"]]:!shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)]'
                                            id='name'
                                            name='name'
                                            type='text'
                                            placeholder={t('Game Name')}
                                            maxLength={GameNameMaxLength}
                                            value={formProps.values.name}
                                            onBlur={formProps.handleBlur}
                                            onChange={formProps.handleChange}
                                        />
                                        {formProps.touched.name && formProps.errors.name ? (
                                            <div className='mt-1 text-xs text-red-300'>
                                                {formProps.errors.name}
                                            </div>
                                        ) : null}
                                    </div>
                                )}

                                <div className='mt-3'>
                                    <GameOptions
                                        formProps={formProps}
                                        gameLink={
                                            currentGameId
                                                ? `${window.location.protocol}//${window.location.host}/play?gameId=${currentGameId}`
                                                : undefined
                                        }
                                    />
                                </div>
                            </>
                        )}

                        <div
                            className={
                                quickJoin
                                    ? 'mt-7 border-t-2 border-border/75 pt-5'
                                    : 'mt-6 border-t-2 border-border/75 pt-5'
                            }
                        >
                            <GameFormats formProps={formProps} />
                        </div>
                        {!tournament && (
                            <div className={quickJoin ? 'mt-4' : ''}>
                                <GameTypes formProps={formProps} />
                            </div>
                        )}

                        <div className='mt-6 flex justify-center gap-2 border-t border-border/55 pt-4'>
                            <Button variant='primary' type='submit'>
                                {quickJoin ? <Trans>Find game</Trans> : <Trans>Start</Trans>}
                            </Button>
                            <Button
                                variant='tertiary'
                                onPress={() => {
                                    dispatch(lobbyActions.cancelNewGame());
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
