import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';

import * as actions from '../../actions';

import { withTranslation, Trans } from 'react-i18next';
import Modal from '../Site/Modal';
import NewTournamentGame from './NewTournamentGame';
import $ from 'jquery';
import ReactClipboard from 'react-clipboardjs-copy';

class TournamentLobby extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tournament: {},
            tournamentGames: [],
            matchesToCreate: []
        };
        this.createGames = this.createGames.bind(this);
        this.sendAttachment = this.sendAttachment.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getOpenMatches = this.getOpenMatches.bind(this);
        this.getMatchLink = this.getMatchLink.bind(this);
        this.getMatchesWithNoGames = this.getMatchesWithNoGames.bind(this);
        this.getTournamentData = this.getTournamentData.bind(this);
        this.getTournamentGames = this.getTournamentGames.bind(this);
        this.getParticipantName = this.getParticipantName.bind(this);
        this.refreshMatches = this.refreshMatches.bind(this);
        this.refreshTournaments = this.refreshTournaments.bind(this);
        this.selectTournament = this.selectTournament.bind(this);
    }

    componentDidMount() {
        this.props.fetchTournaments();
    }

    componentWillReceiveProps(props) {
        const tournamentGames = props.games.filter(x => x.challonge && x.challonge.tournamentId === this.state.tournament.id);
        this.setState({ tournamentGames });
    }

    sendAttachment() {
        this.state.tournamentGames.forEach(game=>{
            this.props.attachMatchLink(game, this.getMatchLink(game));
        });
    }

    createGames (event) {
        let matchesToCreate = this.getMatchesWithNoGames();
        if(event.target.value !== 'all') {
            matchesToCreate = matchesToCreate.filter(x=> x.id === +event.target.value);
        }

        this.setState({ matchesToCreate });
        $('#pendingGameModal').modal('show');
    }

    getMatchesWithNoGames() {
        return this.getOpenMatches().filter(x => !this.state.tournamentGames.map(x=>x.challonge.matchId).includes(x.id));
    }

    closeModal () {
        $('#pendingGameModal').modal('hide');
        this.setState({ matchesToCreate: [] });
    }

    getTournamentData() {
        this.props.fetchTournaments();
    }

    refreshTournaments() {
        this.props.fetchTournaments();
    }

    refreshMatches() {
        if(this.state.tournament) {
            this.props.fetchMatches(this.state.tournament.id);
        }
    }

    //TODO get the select to select based on state
    selectTournament(event) {
        let tournament = this.props.tournaments.find(x=> x.id === +event.target.value);
        if(tournament) {
            this.props.fetchParticipants(event.target.value);
            this.props.fetchMatches(event.target.value);
            this.setState({ tournament });
        }
    }

    getParticipantName(id) {
        if(!this.props.participants) {
            return id;
        }

        const participant = this.props.participants.find(x => x.id === id);
        return participant ? participant.display_name : 'Unknown';
    }

    getOpenMatches() {
        let openMatches = [];
        if(this.props.matches) {
            openMatches = this.props.matches.filter(x => x.state === 'open');
        }

        return openMatches;
    }

    getTournamentGames() {
        const tournamentGames = this.props.games.filter(x => x.challonge && x.challonge.tournamentId === this.state.tournament.id);
        this.setState({ tournamentGames });
    }

    getMatchLink(game) {
        if(game) {
            return `${window.location.protocol}//${window.location.host}/play?gameId=${ game.id }`;
        }
    }

    render() {
        let t = this.props.t;
        let modalProps = {
            id: 'pendingGameModal',
            className: 'settings-popup row',
            bodyClassName: 'col-xs-12',
            noClickToClose: true,
            title: t('Game Options'),
            okButton: t('Create')
        };
        return (
            <div className='full-height'>
                { this.props.bannerNotice ? <AlertPanel type='error' message={ t(this.props.bannerNotice) } /> : null }
                { this.state.errorMessage ? <AlertPanel type='error' message={ t(this.state.errorMessage) } /> : null }

                <div className='col-md-offset-2 col-md-8 full-height'>
                    <Panel title={ t('Tournament Organizer Panel') }>
                        <div className='col-xs-12 game-controls'>
                            <div className='col-sm-8'>
                                <div className='form-group'>
                                    <select className='form-control' onChange={ this.selectTournament }>
                                        <option />
                                        { this.props.tournaments && this.props.tournaments.map((tournament, index) =>
                                            <option value={ tournament.id } key={ index }>{ `${tournament.name} (${tournament.state})` }</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='col-sm-3'>
                                <button className='btn btn-primary'
                                    onClick={ this.refreshTournaments }>
                                    <Trans>Refresh Tournaments</Trans>
                                </button>
                            </div>
                        </div>
                        <div className='col-xs-12'>
                            { this.getOpenMatches().map((match, index) => {
                                const game = this.state.tournamentGames.find(x => x.challonge && x.challonge.matchId === match.id);
                                return (<div className='col-xs-12 match-row' key={ index }>
                                    <div className='col-sm-5'>Round { match.round }: { this.getParticipantName(match.player1_id) } vs { this.getParticipantName(match.player2_id) } ({ match.state }) </div>
                                    <div className='col-sm-3'>
                                        { game ?
                                            <ReactClipboard text={ this.getMatchLink(game) }>
                                                <button className='btn btn-primary'>Copy Game Link</button>
                                            </ReactClipboard>
                                            :
                                            <button className='btn btn-primary' value={ match.id } onClick={ this.createGames }>Create Game</button>
                                        }
                                    </div>
                                    { 0 >= index &&
                                    <div className='col-sm-3'>
                                        <button className='btn btn-primary'
                                            onClick={ this.refreshMatches }>
                                            <Trans>Refresh Matches</Trans>
                                        </button>
                                    </div>
                                    }
                                </div>);
                            })
                            }
                            <div className='col-xs-12'>
                                <div className='col-sm-3'>
                                    <button className='btn btn-primary'
                                        value='all'
                                        disabled={ 0 >= this.getMatchesWithNoGames().length }
                                        onClick={ this.createGames }>
                                        <Trans>Create All Games</Trans>
                                    </button>
                                </div>
                                <div className='col-sm-3'>
                                    <button className='btn btn-primary'
                                        onClick={ this.sendAttachment }
                                        disabled={ false }>
                                    Send Attachment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>
                <Modal { ...modalProps }>
                    <NewTournamentGame
                        closeModal={ this.closeModal }
                        getParticipantName={ this.getParticipantName }
                        defaultGameName={ 'Default Name' }
                        matches={ this.state.matchesToCreate }
                        tournament={ this.state.tournament }/>
                </Modal>
            </div>);
    }
}

TournamentLobby.displayName = 'TournamentLobby';
TournamentLobby.propTypes = {
    attachMatchLink: PropTypes.func,
    bannerNotice: PropTypes.string,
    cancelNewGame: PropTypes.func,
    cancelPasswordJoin: PropTypes.func,
    fetchMatches: PropTypes.func,
    fetchParticipants: PropTypes.func,
    fetchTournaments: PropTypes.func,
    games: PropTypes.array,
    i18n: PropTypes.object,
    matches: PropTypes.array,
    newGame: PropTypes.bool,
    participants: PropTypes.array,
    passwordGame: PropTypes.object,
    setContextMenu: PropTypes.func,
    startNewGame: PropTypes.func,
    t: PropTypes.func,
    tournaments: PropTypes.array,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        attachMatchLink: state.challonge.attachMatchLink,
        fetchTournaments: state.challonge.fetchTournaments,
        fetchMatches: state.challonge.fetchMatches,
        fetchParticipants: state.challonge.fetchParticipants,
        tournaments: state.challonge.tournaments,
        matches: state.challonge.matches,
        participants: state.challonge.participants,
        bannerNotice: state.lobby.notice,
        currentGame: state.lobby.currentGame,
        games: state.lobby.games,
        newGame: state.lobby.newGame,
        passwordGame: state.lobby.passwordGame,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(TournamentLobby));
