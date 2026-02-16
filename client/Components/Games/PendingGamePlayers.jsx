import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

import Panel from '../Site/Panel';
import Avatar from '../Site/Avatar';

/**
 * @typedef PendingGamePlayersProps
 * @property {PendingGame} currentGame The current pending game
 * @property {User} user The logged in user
 * @property {function(): void} onSelectDeck The callback to be invoked when a deck selection is requested
 */

/**
 * @param {PendingGamePlayersProps} props
 */
const PendingGamePlayers = ({ currentGame, user, onSelectDeck }) => {
    const { t } = useTranslation();
    const players = Object.values(currentGame.players || {});
    const sortedPlayers = players.sort((left, right) => {
        if (left.name === currentGame.owner) {
            return -1;
        }
        if (right.name === currentGame.owner) {
            return 1;
        }

        return left.name.localeCompare(right.name);
    });
    const seats = [sortedPlayers[0] || null, sortedPlayers[1] || null];
    const isSealed = currentGame.gameFormat === 'sealed';

    const getSeatReadiness = (player) => {
        if (!player || !player.deck || !player.deck.selected) {
            return {
                label: t('Waiting for deck'),
                tone: 'text-amber-300 bg-amber-500/10 border-amber-500/30'
            };
        }

        if (player.deck.status?.basicRules === false) {
            return {
                label: t('Deck needs fixes'),
                tone: 'text-amber-300 bg-amber-500/10 border-amber-500/30'
            };
        }

        return {
            label: t('Ready'),
            tone: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
        };
    };

    const getDeckValidity = (status) => {
        if (!status) {
            return {
                label: t('Pending'),
                tone: 'text-zinc-300 bg-zinc-500/10 border-zinc-500/25'
            };
        }

        const isValid =
            (status.usageLevel === 0 || status.verified) &&
            status.basicRules &&
            !status.notVerified &&
            status.noUnreleasedCards &&
            !status.impossible;

        if (isValid) {
            return {
                label: t('Valid'),
                tone: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
            };
        }

        return {
            label: t('Invalid'),
            tone: 'text-rose-300 bg-rose-500/10 border-rose-500/30'
        };
    };

    return (
        <Panel
            headerVariant='context'
            title={t('Players')}
            titleClass='text-sm font-medium tracking-wide text-zinc-200'
            contentClassName='py-3'
        >
            <div className='grid gap-3 sm:grid-cols-2'>
                {seats.map((player, index) => {
                    const playerIsMe = player && player.name === user?.username;
                    const readiness = player ? getSeatReadiness(player) : null;
                    const deckValidity = player ? getDeckValidity(player.deck?.status) : null;

                    if (!player) {
                        return (
                            <div
                                className='grid min-h-20 grid-cols-[minmax(0,1fr)_auto] grid-rows-2 items-center gap-x-3 gap-y-1 rounded-md border border-border/60 bg-surface-secondary/35 px-3 py-2'
                                key={`seat-${index}`}
                            >
                                <div className='min-w-0 text-sm font-semibold text-zinc-200'>
                                    <Trans>Empty seat</Trans>
                                </div>
                                <div />
                                <div className='min-w-0 text-sm text-zinc-400'>
                                    <span className='block truncate'>
                                        <Trans>Waiting for player</Trans>
                                    </span>
                                </div>
                                <div />
                            </div>
                        );
                    }

                    const userClass =
                        'username truncate font-semibold' +
                        (player.role ? ` ${player.role.toLowerCase()}-role` : '');

                    const deckName = playerIsMe
                        ? player.deck?.selected
                            ? isSealed
                                ? t('Sealed deck selected')
                                : player.deck?.name
                            : t('No deck selected')
                        : player.deck?.selected
                        ? t('Selected')
                        : t('Not selected');

                    return (
                        <div
                            className='grid min-h-20 grid-cols-[minmax(0,1fr)_auto] grid-rows-2 items-center gap-x-3 gap-y-1 rounded-md border border-border/70 bg-surface-secondary/50 px-3 py-2'
                            key={player.name}
                        >
                            <div className='flex min-w-0 items-center gap-2'>
                                <Avatar imgPath={player.avatar} />
                                <span className={userClass}>{player.name}</span>
                            </div>
                            <span
                                className={`shrink-0 whitespace-nowrap rounded border px-1.5 py-0 text-xs font-medium leading-4 ${readiness.tone}`}
                            >
                                {readiness.label}
                            </span>

                            <div className='min-w-0 flex items-center gap-1 text-sm text-zinc-300'>
                                <span className='shrink-0 text-zinc-400'>
                                    <Trans>Deck:</Trans>
                                </span>
                                <div className='min-w-0 flex-1'>
                                    {playerIsMe && !isSealed ? (
                                        <button
                                            className='block w-full truncate text-left align-middle text-zinc-200 underline decoration-border/60 underline-offset-2 hover:text-zinc-100'
                                            onClick={onSelectDeck}
                                            type='button'
                                        >
                                            {deckName}
                                        </button>
                                    ) : (
                                        <span className='block truncate text-zinc-200'>
                                            {deckName}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span
                                className={`shrink-0 whitespace-nowrap rounded border px-1.5 py-0 text-xs font-medium leading-4 ${deckValidity.tone}`}
                                title={
                                    player.deck?.status?.notVerified
                                        ? t('Enhancements not verified')
                                        : undefined
                                }
                            >
                                {deckValidity.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </Panel>
    );
};

export default PendingGamePlayers;
