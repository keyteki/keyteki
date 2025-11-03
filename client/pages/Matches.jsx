// @ts-nocheck
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { useLoadUserGamesQuery } from '../redux/slices/apiSlice';

import { Trans, useTranslation } from 'react-i18next';

const Matches = () => {
    const { t } = useTranslation();
    const { isLoading, error } = useLoadUserGamesQuery();

    const games = useSelector(
        (state) =>
            state.games &&
            state.games.games &&
            state.games.games.filter(
                (game) =>
                    game.players &&
                    game.players.length === 2 &&
                    game.decks &&
                    game.decks.length === 2
            )
    );

    const computeKeys = useCallback((player) => {
        if (player.keys === null || player.keys === undefined) {
            return 0;
        }

        if (!isNaN(player.keys)) {
            return player.keys;
        }

        return player.keys.yellow + player.keys.blue + player.keys.red;
    }, []);

    const computeWinner = useCallback((game) => {
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
    }, []);

    if (isLoading) {
        return (
            <div>
                <Trans>Loading matches from the server...</Trans>
            </div>
        );
    }

    if (error) {
        return (
            <AlertPanel type='error' title='' message={error.message || 'An error occurred'}>
                {null}
            </AlertPanel>
        );
    }

    const rows = games
        ? games.map((game) => {
              const startedAt = moment(game.startedAt);
              const finishedAt = moment(game.finishedAt);
              const duration = moment.duration(finishedAt.diff(startedAt));

              const myKeys = computeKeys(game.players[0]);
              const oppKeys = computeKeys(game.players[1]);

              return (
                  <tr key={game.gameId}>
                      <td>{game.decks[0].name}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{game.players[1].name}</td>
                      <td>{game.decks[1].name}</td>
                      <td>{computeWinner(game)}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{t(game.winReason)}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                          {myKeys} x {oppKeys}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{t(game.gameType)}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{t(game.gameFormat)}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                          {moment(game.startedAt).format('YYYY-MM-DD HH:mm')}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
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
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>
                            <Trans>My Deck</Trans>
                        </th>
                        <th>
                            <Trans>Opponent</Trans>
                        </th>
                        <th>
                            <Trans>Opponent&apos;s Deck</Trans>
                        </th>
                        <th>
                            <Trans>Winner</Trans>
                        </th>
                        <th>
                            <Trans>Reason</Trans>
                        </th>
                        <th>
                            <Trans>Keys</Trans>
                        </th>
                        <th>
                            <Trans>Type</Trans>
                        </th>
                        <th>
                            <Trans>Format</Trans>
                        </th>
                        <th>
                            <Trans>Started At</Trans>
                        </th>
                        <th>
                            <Trans>Duration</Trans>
                        </th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );

    return (
        <div className='col-sm-10 col-sm-offset-1 profile full-height'>
            <Panel title={t('Matches')}>{table}</Panel>
        </div>
    );
};

Matches.displayName = 'Matches';

export default Matches;
