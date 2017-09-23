import React from 'react';
import {connect} from 'react-redux';
import {toastr} from 'react-redux-toastr';
import _ from 'underscore';

import Avatar from './Avatar.jsx';
import * as actions from './actions';

class InnerGameList extends React.Component {
    constructor() {
        super();

        this.joinGame = this.joinGame.bind(this);
    }

    joinGame(event, game) {
        event.preventDefault();

        if(!this.props.username) {
            toastr.error('Please login before trying to join a game');
            return;
        }

        if(game.needsPassword) {
            this.props.joinPasswordGame(game, 'Join');
        } else {
            this.props.socket.emit('joingame', game.id);
        }
    }

    canWatch(game) {
        return !this.props.currentGame && game.allowSpectators;
    }

    watchGame(event, game) {
        event.preventDefault();

        if(!this.props.username) {
            toastr.error('Please login before trying to watch a game');
            return;
        }

        if(game.needsPassword) {
            this.props.joinPasswordGame(game, 'Watch');
        } else {
            this.props.socket.emit('watchgame', game.id);
        }
    }

    removeGame(event, game) {
        event.preventDefault();

        this.props.socket.emit('removegame', game.id);
    }

    render() {
        let gameList = _.map(this.props.games, game => {
            let firstPlayer = true;
            let gameRow = [];

            _.each(game.players, player => {
                let playerElement = null;

                if(firstPlayer) {
                    gameRow.push(
                        <span className='col-xs-4 col-sm-3 game-row-avatar'>
                            <span className='hidden-xs col-sm-3 game-row-avatar'>
                                <Avatar emailHash={ player.emailHash } forceDefault={ player.settings ? player.settings.disableGravatar : false } />
                            </span>
                            <span className='player-name col-sm-8'>{ player.name }</span>
                        </span>);
                    gameRow.push();
                    gameRow.push(<span className={ 'hidden-xs col-xs-1 game-icon icon-' + player.faction } />);

                    firstPlayer = false;
                } else {
                    gameRow.push(<span className='col-xs-1 game-row-vs text-center'><b> vs </b></span>);
                    gameRow.push(<span className={ 'hidden-xs col-xs-1 game-icon icon-' + player.faction } />);
                    gameRow.push(
                        <span className='col-xs-4 col-sm-3 game-row-avatar'>
                            <span className='player-name col-sm-8'>{ player.name }</span>
                            <span className='hidden-xs game-row-avatar pull-right col-sm-3'>
                                <Avatar emailHash={ player.emailHash } forceDefault={ player.settings ? player.settings.disableGravatar : false } />
                            </span>
                        </span>);
                }

                return playerElement;
            });

            let gameTitle = '';

            if(game.needsPassword) {
                gameTitle += '[Private] ';
            }

            if(game.gameType) {
                gameTitle += '[' + game.gameType + '] ';
            }

            gameTitle += game.name;

            return (
                <div key={ game.id } className={ 'game-row' + (game.node && this.props.isAdmin ? ' ' + game.node : '') }>
                    <span className='col-xs-12 game-title'>
                        { this.props.isAdmin ? <a href='#' className='glyphicon glyphicon-remove' onClick={ event => this.removeGame(event, game) } /> : null }
                        <b>{ gameTitle }</b>
                    </span>
                    <div>{ gameRow }</div>
                    <div className='col-xs-3 game-row-buttons pull-right'>
                        { (this.props.currentGame || _.size(game.players) === 2 || game.started) ?
                            null :
                            <button className='btn btn-primary pull-right' onClick={ event => this.joinGame(event, game) }>Join</button>
                        }
                        { this.canWatch(game) ?
                            <button className='btn btn-primary pull-right' onClick={ event => this.watchGame(event, game) }>Watch</button> : null }
                    </div>
                </div>
            );
        });

        return (
            <div className='game-list'>
                { gameList }
            </div>);
    }
}

InnerGameList.displayName = 'GameList';
InnerGameList.propTypes = {
    currentGame: React.PropTypes.object,
    games: React.PropTypes.array,
    isAdmin: React.PropTypes.bool,
    joinPasswordGame: React.PropTypes.func,
    showNodes: React.PropTypes.bool,
    socket: React.PropTypes.object,
    username: React.PropTypes.string
};

function mapStateToProps(state) {
    return {
        currentGame: state.games.currentGame,
        isAdmin: state.auth.isAdmin,
        socket: state.socket.socket,
        username: state.auth.username
    };
}

const GameList = connect(mapStateToProps, actions)(InnerGameList);

export default GameList;

