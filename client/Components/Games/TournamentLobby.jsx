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

class TournamentLobby extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tournament: ''
        };
        this.createGames = this.createGames.bind(this);
        this.getOpenMatches = this.getOpenMatches.bind(this);
        this.getTournamentData = this.getTournamentData.bind(this);
        this.getParticipantName = this.getParticipantName.bind(this);
        this.refreshMatches = this.refreshMatches.bind(this);
        this.selectTournament = this.selectTournament.bind(this);
    }

    componentDidMount() {
        this.props.fetchTournaments();
    }

    createGames () {
        $('#pendingGameModal').modal('show');
    }

    getTournamentData() {
        this.props.fetchTournaments();
    }

    //TODO split match an participant data API calls
    refreshMatches() {
        this.props.fetchMatches(this.state.tournament);
    }

    //TODO get the select to select based on state
    selectTournament(event) {
        this.props.fetchMatches(event.target.value);
        this.setState({ tournament: event.target.value });
    }

    getParticipantName(id) {
        const participant = this.props.participants.find(x => x.id === id);
        return participant ? participant.display_name : 'Blank';
    }

    getOpenMatches() {
        let openMatches = [];
        if(this.props.matches) {
            openMatches = this.props.matches.filter(x => x.state === 'open');
        }

        return openMatches;
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
                            <div className='col-sm-3'>
                                <button className='btn btn-primary' disabled={ !this.state.tournament } onClick={ this.refreshMatches } ><Trans>Refresh Matches</Trans></button>
                            </div>
                            <div className='col-md-12'>
                                <div className='form-group'>
                                    <select className='form-control' onChange={ this.selectTournament }>
                                        <option />
                                        { this.props.tournaments && this.props.tournaments.map((tournament, index) =>
                                            <option value={ tournament.id } key={ index }>{ `${tournament.name} (${tournament.state})` }</option>)
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='col-xs-12'>
                            <div className='col-sm-5'>
                                { this.getOpenMatches().map((match, index) =>
                                    <div key={ index }>Round { match.round }: { this.getParticipantName(match.player1_id) } vs { this.getParticipantName(match.player2_id) } ({ match.state }) </div>)
                                }
                            </div>
                            <div className='col-sm-3'>
                                <button className='btn btn-primary' disabled={ 0 >= this.getOpenMatches().length } onClick={ this.createGames } ><Trans>Create Games</Trans></button>
                            </div>
                        </div>
                    </Panel>
                </div>
                <Modal { ...modalProps }>
                    <NewTournamentGame defaultGameName={ 'Default Name' } />
                </Modal>
            </div>);
    }
}

TournamentLobby.displayName = 'TournamentLobby';
TournamentLobby.propTypes = {
    bannerNotice: PropTypes.string,
    cancelNewGame: PropTypes.func,
    cancelPasswordJoin: PropTypes.func,
    currentGame: PropTypes.object,
    fetchMatches: PropTypes.func,
    fetchTournaments: PropTypes.func,
    games: PropTypes.array,
    i18n: PropTypes.object,
    leaveGame: PropTypes.func,
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
        fetchTournaments: state.challonge.fetchTournaments,
        fetchMatches: state.challonge.fetchMatches,
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
