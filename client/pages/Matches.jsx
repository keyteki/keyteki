import React from 'react';
import moment from 'moment';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { useGetUserGamesQuery } from '../redux/api';

import { Trans, useTranslation } from 'react-i18next';

const computeKeys = (player) => {
    if (player.keys === null || player.keys === undefined) {
        return 0;
    }

    if (!isNaN(player.keys)) {
        return player.keys;
    }

    return player.keys.yellow + player.keys.blue + player.keys.red;
};

const computeWinner = (game) => {
    if (
        !game.winner ||
        game.winner === game.players[0].name ||
        game.winner === game.players[1].name
    ) {
        return game.winner;
    }

    if (game.winner === game.players[0].deck) {
        return game.players[0].name;
    }

    if (game.winner === game.players[1].deck) {
        return game.players[1].name;
    }
};

const Matches = () => {
    const { t } = useTranslation();
    const { data: gamesResponse, isLoading, isError, error } = useGetUserGamesQuery();
    const games =
        gamesResponse?.games?.filter(
            (game) =>
                game.players && game.players.length === 2 && game.decks && game.decks.length === 2
        ) || [];

    if (isLoading) {
        return (
            <div>
                <Trans>Loading matches from the server...</Trans>
            </div>
        );
    }

    if (isError) {
        return <AlertPanel type='error' message={error?.data?.message} />;
    }

    const matches = games
        ? games.map((game) => {
              const startedAt = moment(game.startedAt);
              const finishedAt = moment(game.finishedAt);
              const duration = moment.duration(finishedAt.diff(startedAt));

              const myKeys = computeKeys(game.players[0]);
              const oppKeys = computeKeys(game.players[1]);

              return (
                  <tr key={game.gameId}>
                      <td>{game.decks[0].name}</td>
                      <td className='whitespace-nowrap'>{game.players[1].name}</td>
                      <td>{game.decks[1].name}</td>
                      <td>{computeWinner(game)}</td>
                      <td className='whitespace-nowrap'>{t(game.winReason)}</td>
                      <td className='whitespace-nowrap'>
                          {myKeys} x {oppKeys}
                      </td>
                      <td className='whitespace-nowrap'>{t(game.gameType)}</td>
                      <td className='whitespace-nowrap'>{t(game.gameFormat)}</td>
                      <td className='whitespace-nowrap'>
                          {moment(game.startedAt).format('YYYY-MM-DD HH:mm')}
                      </td>
                      <td className='whitespace-nowrap'>
                          {duration.get('minutes')}m {duration.get('seconds')}s
                      </td>
                  </tr>
              );
          })
        : null;

    const table =
        games && games.length === 0 ? (
            <div>You have no recorded matches.</div>
        ) : (
            <table className='w-full border-collapse text-left text-sm text-zinc-100'>
                <thead>
                    <tr className='border-b border-zinc-600/70'>
                        <th className='px-2 py-2 font-semibold'>
                            <Trans>My Deck</Trans>
                        </th>
                        <th className='px-2 py-2 font-semibold'>
                            <Trans>Opponent</Trans>
                        </th>
                        <th className='px-2 py-2 font-semibold'>
                            <Trans>Opponent&apos;s Deck</Trans>
                        </th>
                        <th className='px-2 py-2 font-semibold'>
                            <Trans>Winner</Trans>
                        </th>
                        <th className='px-2 py-2 font-semibold'>
                            <Trans>Reason</Trans>
                        </th>
                        <th className='px-2 py-2 font-semibold'>
                            <Trans>Keys</Trans>
                        </th>
                        <th className='px-2 py-2 font-semibold'>
                            <Trans>Type</Trans>
                        </th>
                        <th className='px-2 py-2 font-semibold'>
                            <Trans>Format</Trans>
                        </th>
                        <th className='px-2 py-2 font-semibold'>
                            <Trans>Started At</Trans>
                        </th>
                        <th className='px-2 py-2 font-semibold'>
                            <Trans>Duration</Trans>
                        </th>
                    </tr>
                </thead>
                <tbody className='[&>tr:nth-child(odd)]:bg-black/20 [&>tr>td]:px-2 [&>tr>td]:py-1.5'>
                    {matches}
                </tbody>
            </table>
        );

    return (
        <div className='profile mx-auto min-h-full w-full max-w-6xl'>
            <Panel title={t('Matches')}>{table}</Panel>
        </div>
    );
};

Matches.displayName = 'Matches';

export default Matches;
