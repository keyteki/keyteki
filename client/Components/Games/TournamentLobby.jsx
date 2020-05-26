import $ from 'jquery';
import PropTypes from 'prop-types';
import React from 'react';
import ReactClipboard from 'react-clipboardjs-copy';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { withTranslation, Trans } from 'react-i18next';

import Modal from '../Site/Modal';
import NewGame from './NewGame';
import Panel from '../Site/Panel';
import ApiStatus from '../Site/ApiStatus';
import * as actions from '../../redux/actions';

class TournamentLobby extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showMessage: false,
            tournament: {},
            matchesToCreate: []
        };

        this.closeModal = this.closeModal.bind(this);
        this.createGames = this.createGames.bind(this);
        this.getMatchLink = this.getMatchLink.bind(this);
        this.getMatchesWithNoGames = this.getMatchesWithNoGames.bind(this);
        this.getMatchesWithGames = this.getMatchesWithGames.bind(this);
        this.getOpenMatches = this.getOpenMatches.bind(this);
        this.getParticipantName = this.getParticipantName.bind(this);
        this.getTournamentData = this.getTournamentData.bind(this);
        this.getTournamentGames = this.getTournamentGames.bind(this);
        this.refreshMatches = this.refreshMatches.bind(this);
        this.refreshTournaments = this.refreshTournaments.bind(this);
        this.selectTournament = this.selectTournament.bind(this);
        this.sendAttachment = this.sendAttachment.bind(this);
        this.watchGame = this.watchGame.bind(this);
    }

    componentDidMount() {
        if (!this.props.tournaments) {
            this.props.fetchTournaments();
        }

        if (this.props.matches && this.props.matches.length > 0) {
            this.setTournament(this.props.matches[0].tournament_id);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.challongeMessage !== this.props.challongeMessage) {
            this.toggleMessage();
        }
    }

    closeModal() {
        $('#pendingGameModal').modal('hide');
        this.setState({ matchesToCreate: [] });
    }

    createGames(event) {
        let matchesToCreate = this.getMatchesWithNoGames();
        if (event.target.value !== 'all') {
            matchesToCreate = matchesToCreate.filter((x) => x.id === +event.target.value);
        }

        this.setState({ matchesToCreate });
        $('#pendingGameModal').modal('show');
    }

    getParticipantName(id) {
        if (!this.props.participants) {
            return id;
        }

        const participant = this.props.participants.find((x) => x.id === id);
        return participant ? participant.display_name : 'Unknown';
    }

    getMatchLink(game) {
        if (game) {
            return `${window.location.protocol}//${window.location.host}/play?gameId=${game.id}`;
        }
    }

    getOpenMatches() {
        let openMatches = [];
        if (this.props.matches) {
            openMatches = this.props.matches.filter((x) => x.state === 'open');
        }

        return openMatches;
    }

    getMatchesWithGames() {
        return this.getOpenMatches().filter((x) =>
            this.getTournamentGames()
                .map((x) => x.challonge.matchId)
                .includes(x.id)
        );
    }

    getMatchesWithNoGames() {
        return this.getOpenMatches().filter(
            (x) =>
                !this.getTournamentGames()
                    .map((x) => x.challonge.matchId)
                    .includes(x.id)
        );
    }

    getTournamentData() {
        this.props.fetchTournaments();
    }

    getTournamentGames() {
        return this.props.games.filter(
            (x) => x.challonge && x.challonge.tournamentId === this.state.tournament.id
        );
    }

    refreshTournaments() {
        this.props.fetchTournaments();
    }

    refreshMatches() {
        if (this.state.tournament) {
            this.props.fetchMatches(this.state.tournament.id);
        }
    }

    selectTournament(event) {
        let tournament = this.props.tournaments.find((x) => x.id === +event.target.value);
        if (tournament) {
            this.props.fetchFullTournament(event.target.value);
            this.setState({ tournament });
        }
    }

    setTournament(id) {
        let tournament = this.props.tournaments.find((x) => x.id === id);
        if (tournament) {
            this.setState({ tournament });
        }
    }

    sendAttachment() {
        const matchData = this.getTournamentGames().map((game) => {
            return {
                attachment: this.getMatchLink(game),
                matchId: game.challonge.matchId,
                tournamentId: game.challonge.tournamentId
            };
        });
        this.props.attachMatchLink(matchData);
    }

    toggleMessage() {
        const type = this.props.challongeApiSuccess ? 'success' : 'error';
        const message = this.props.t(this.props.challongeMessage);
        toastr[type](message);
    }

    watchGame(event) {
        this.props.navigate('/play', `?gameId=${event.target.value}`);
    }

    render() {
        let t = this.props.t;
        let modalProps = {
            bodyClassName: 'col-xs-12',
            className: 'settings-popup row',
            id: 'pendingGameModal',
            noClickToClose: true,
            okButton: t('Create'),
            title: t('Game Options')
        };
        const openMatches = this.getOpenMatches();
        return (
            <div className='full-height'>
                <div className='col-md-offset-2 col-md-8 full-height'>
                    <Panel title={t('Tournament Organizer Panel')}>
                        <ApiStatus
                            apiState={this.props.tournamentApiState}
                            successMessage={this.state.successMessage}
                        />
                        <div className='col-xs-12 game-controls'>
                            <div className='col-sm-8'>
                                <div className='form-group'>
                                    <select
                                        className='form-control'
                                        value={this.state.tournament.id}
                                        onChange={this.selectTournament}
                                    >
                                        {!this.state.tournament.id && <option />}
                                        {this.props.tournaments &&
                                            this.props.tournaments.map((tournament, index) => (
                                                <option
                                                    value={tournament.id}
                                                    key={index}
                                                >{`${tournament.name} (${tournament.state})`}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                            <div className='col-sm-3'>
                                <button
                                    className='btn btn-primary'
                                    onClick={this.refreshTournaments}
                                >
                                    <Trans>Refresh Tournaments</Trans>
                                    {this.props.tournamentApiState &&
                                        this.props.tournamentApiState.loading && (
                                            <span className='spinner button-spinner' />
                                        )}
                                </button>
                            </div>
                        </div>
                        <div className='col-xs-12'>
                            {openMatches[0] && (
                                <div className='match-round'>
                                    {'Round: ' + openMatches[0].round}
                                </div>
                            )}
                            {openMatches.map((match, index) => {
                                const game = this.getTournamentGames().find(
                                    (x) => x.challonge && x.challonge.matchId === match.id
                                );
                                return (
                                    <div className='col-xs-12 match-row' key={index}>
                                        <div className='col-sm-5'>
                                            Table {index + 1}:{' '}
                                            {this.getParticipantName(match.player1_id)} vs{' '}
                                            {this.getParticipantName(match.player2_id)} (
                                            {game && game.started ? 'In Progress' : 'Pending'}){' '}
                                        </div>
                                        <div className='col-sm-3'>
                                            {game ? (
                                                game.started ? (
                                                    <button
                                                        className='btn btn-primary'
                                                        value={game.id}
                                                        onClick={this.watchGame}
                                                    >
                                                        <Trans>Watch</Trans>
                                                    </button>
                                                ) : (
                                                    <ReactClipboard text={this.getMatchLink(game)}>
                                                        <button className='btn btn-primary'>
                                                            Copy Game Link
                                                        </button>
                                                    </ReactClipboard>
                                                )
                                            ) : (
                                                <button
                                                    className='btn btn-primary'
                                                    value={match.id}
                                                    onClick={this.createGames}
                                                >
                                                    Create Game
                                                </button>
                                            )}
                                        </div>
                                        {index <= 0 && (
                                            <div className='col-sm-3'>
                                                <button
                                                    className='btn btn-primary'
                                                    onClick={this.refreshMatches}
                                                >
                                                    <Trans>Refresh Matches</Trans>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div className='col-xs-12'>
                                <div className='col-sm-3'>
                                    <button
                                        className='btn btn-primary'
                                        value='all'
                                        disabled={this.getMatchesWithNoGames().length <= 0}
                                        onClick={this.createGames}
                                    >
                                        <Trans>Create All Games</Trans>
                                    </button>
                                </div>
                                <div className='col-sm-3'>
                                    <button
                                        className='btn btn-primary'
                                        onClick={this.sendAttachment}
                                        disabled={this.getMatchesWithGames().length <= 0}
                                    >
                                        <Trans>Send Attachments</Trans>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>
                <Modal {...modalProps}>
                    <NewGame
                        closeModal={this.closeModal}
                        defaultGameName=''
                        defaultGameType='competitive'
                        gamePrivate
                        gameTimeLimit
                        getParticipantName={this.getParticipantName}
                        matches={this.state.matchesToCreate}
                        muteSpectators
                        showHand
                        tournament={this.state.tournament}
                    />
                </Modal>
            </div>
        );
    }
}

TournamentLobby.displayName = 'TournamentLobby';
TournamentLobby.propTypes = {
    attachMatchLink: PropTypes.func,
    attachments: PropTypes.array,
    bannerNotice: PropTypes.string,
    cancelNewGame: PropTypes.func,
    cancelPasswordJoin: PropTypes.func,
    challongeApiSuccess: PropTypes.bool,
    challongeMessage: PropTypes.string,
    fetchFullTournament: PropTypes.func,
    fetchMatches: PropTypes.func,
    fetchParticipants: PropTypes.func,
    fetchTournaments: PropTypes.func,
    games: PropTypes.array,
    i18n: PropTypes.object,
    joinPasswordGame: PropTypes.func,
    matches: PropTypes.array,
    navigate: PropTypes.func,
    newGame: PropTypes.bool,
    participants: PropTypes.array,
    passwordGame: PropTypes.object,
    setContextMenu: PropTypes.func,
    socket: PropTypes.object,
    startNewGame: PropTypes.func,
    t: PropTypes.func,
    tournamentApiState: PropTypes.object,
    tournaments: PropTypes.array,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        attachMatchLink: state.challonge.attachMatchLink,
        attachments: state.challonge.attachments,
        bannerNotice: state.lobby.notice,
        challongeApiSuccess: state.challonge.success,
        currentGame: state.lobby.currentGame,
        fetchFullTournament: state.challonge.fetchFullTournament,
        fetchMatches: state.challonge.fetchMatches,
        fetchParticipants: state.challonge.fetchParticipants,
        fetchTournaments: state.challonge.fetchTournaments,
        games: state.lobby.games,
        matches: state.challonge.matches,
        challongeMessage: state.challonge.message,
        newGame: state.lobby.newGame,
        participants: state.challonge.participants,
        passwordGame: state.lobby.passwordGame,
        socket: state.lobby.socket,
        tournamentApiState: state.api.REQUEST_TOURNAMENTS,
        tournaments: state.challonge.tournaments,
        user: state.account.user
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(TournamentLobby));
