import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import * as actions from '../redux/actions';

import { withTranslation, Trans } from 'react-i18next';

class Matches extends React.Component {
    componentDidMount() {
        this.props.loadUserGames();
    }

    computeKeys(player) {
        if (player.keys === null || player.keys === undefined) {
            return 0;
        }

        if (!isNaN(player.keys)) {
            return player.keys;
        }

        return player.keys.yellow + player.keys.blue + player.keys.red;
    }

    computeWinner(game) {
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
    }

    render() {
        let t = this.props.t;
        let content = null;

        if (this.props.apiLoading) {
            content = (
                <div>
                    <Trans>Loading matches from the server...</Trans>
                </div>
            );
        } else if (!this.props.apiSuccess) {
            content = <AlertPanel type='error' message={this.props.apiMessage} />;
        } else {
            let matches = this.props.games
                ? this.props.games.map((game) => {
                      var startedAt = moment(game.startedAt);
                      var finishedAt = moment(game.finishedAt);
                      var duration = moment.duration(finishedAt.diff(startedAt));

                      var myKeys = this.computeKeys(game.players[0]);
                      var oppKeys = this.computeKeys(game.players[1]);

                      return (
                          <tr key={game.gameId}>
                              <td>{game.decks[0].name}</td>
                              <td style={{ 'white-space': 'nowrap' }}>{game.players[1].name}</td>
                              <td>{game.decks[1].name}</td>
                              <td>{this.computeWinner(game)}</td>
                              <td style={{ 'white-space': 'nowrap' }}>{t(game.winReason)}</td>
                              <td style={{ 'white-space': 'nowrap' }}>
                                  {myKeys} x {oppKeys}
                              </td>
                              <td style={{ 'white-space': 'nowrap' }}>{t(game.gameType)}</td>
                              <td style={{ 'white-space': 'nowrap' }}>{t(game.gameFormat)}</td>
                              <td style={{ 'white-space': 'nowrap' }}>
                                  {moment(game.startedAt).format('YYYY-MM-DD HH:mm')}
                              </td>
                              <td style={{ 'white-space': 'nowrap' }}>
                                  {duration.get('minutes')}m {duration.get('seconds')}s
                              </td>
                          </tr>
                      );
                  })
                : null;

            let table =
                this.props.games && this.props.games.length === 0 ? (
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
                        <tbody>{matches}</tbody>
                    </table>
                );

            content = (
                <div className='col-sm-10 col-sm-offset-1 profile full-height'>
                    <Panel title={t('Matches')}>{table}</Panel>
                </div>
            );
        }

        return content;
    }
}

Matches.displayName = 'Matches';
Matches.propTypes = {
    apiLoading: PropTypes.bool,
    apiMessage: PropTypes.string,
    apiSuccess: PropTypes.bool,
    games: PropTypes.array,
    i18n: PropTypes.object,
    loadUserGames: PropTypes.func,
    loading: PropTypes.bool,
    t: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiLoading: state.api.REQUEST_USERGAMES ? state.api.REQUEST_USERGAMES.loading : undefined,
        apiMessage: state.api.REQUEST_USERGAMES ? state.api.REQUEST_USERGAMES.message : undefined,
        apiSuccess: state.api.REQUEST_USERGAMES ? state.api.REQUEST_USERGAMES.success : undefined,
        games:
            state.games &&
            state.games.games &&
            state.games.games.filter(
                (game) =>
                    game.players &&
                    game.players.length === 2 &&
                    game.decks &&
                    game.decks.length === 2
            ),
        loading: state.api.loading
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(Matches));
