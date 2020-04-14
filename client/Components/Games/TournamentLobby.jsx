import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import GameList from './GameList';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';

import * as actions from '../../actions';

import { withTranslation, Trans } from 'react-i18next';

class TournamentLobby extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tournaments: []
        };
        this.getTournamentData = this.getTournamentData.bind(this);
    }

    componentDidMount() {
        this.props.fetchTournaments();
    }

    componentWillReceiveProps(props) {
        if(props.tournaments) {
            this.setState({ tournaments: props.tournaments });
        }
    }

    getTournamentData() {
        this.props.fetchTournaments();
    }

    render() {
        let t = this.props.t;

        return (
            <div className='full-height'>
                <div className='col-md-offset-2 col-md-8 banner-kote'>
                    <a target='_blank' rel='noopener noreferrer' href='https://www.facebook.com/groups/kotevent/permalink/891154581314876/'><img src='/kote/kote4.png' width='100%'/></a>
                </div>
                { this.props.bannerNotice ? <AlertPanel type='error' message={ t(this.props.bannerNotice) } /> : null }
                { this.state.errorMessage ? <AlertPanel type='error' message={ t(this.state.errorMessage) } /> : null }

                <div className='col-md-offset-2 col-md-8 full-height'>
                    <Panel title={ t('TO Options') }>
                        <div className='col-xs-12 game-controls'>
                            <div className='col-sm-3 join-buttons'>
                                <button className='btn btn-primary' onClick={ this.getTournamentData } ><Trans>Get Tournaments</Trans></button>
                            </div>
                            <div className='col-md-12'>
                                <div className='form-group'>
                                    <select className='form-control' onChange={ this.onChangeExpansionFilter }>
                                        { this.state.tournaments.map(tournament =>
                                            <option key={ tournament.id }>{ tournament.name }</option>
                                        ) }
                                    </select>
                                </div>
                            </div>

                        </div>
                        <div className='col-xs-12'>
                            { this.props.games.length === 0 ? <AlertPanel type='info' message={ t('No games are currently in progress.') } /> : <GameList games={ this.props.games } gameFilter={ this.state.filter } /> }
                        </div>
                    </Panel>
                </div>
            </div>);
    }
}

TournamentLobby.displayName = 'TournamentLobby';
TournamentLobby.propTypes = {
    bannerNotice: PropTypes.string,
    cancelNewGame: PropTypes.func,
    cancelPasswordJoin: PropTypes.func,
    currentGame: PropTypes.object,
    fetchTournaments: PropTypes.func,
    games: PropTypes.array,
    i18n: PropTypes.object,
    leaveGame: PropTypes.func,
    newGame: PropTypes.bool,
    passwordGame: PropTypes.object,
    setContextMenu: PropTypes.func,
    startNewGame: PropTypes.func,
    tournaments: PropTypes.array,
    t: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        fetchTournaments: state.challonge.fetchTournaments,
        tournaments: state.challonge.tournaments,
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
