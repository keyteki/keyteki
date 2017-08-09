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
        var gameList = _.map(this.props.games, game => {
            var firstPlayer = true;

            var sides = _.map(game.players, player => {
                var playerElement = null;

                if(firstPlayer) {
                    playerElement = (
                        <span>
                            <span><Avatar emailHash={ player.emailHash } forceDefault={ player.settings ? player.settings.disableGravatar : false } /></span>
                            <span className='player-name'>{ player.name }</span>
                            <span className={ ' game-icon icon-' + player.faction } />
                        </span>);

                    firstPlayer = false;
                } else {
                    playerElement = (
                        <span>
                            <span className={ ' game-icon icon-' + player.faction } />
                            <span className='player-name'>{ player.name }</span>
                            <span><Avatar emailHash={ player.emailHash } forceDefault={ player.settings ? player.settings.disableGravatar : false } /></span>
                        </span>);
                }

                return playerElement;
            });

            var gameLayout = undefined;

            if(sides.length === 2) {
                gameLayout = <span>{ sides[0] }<span><b> vs </b></span>{ sides[1] }</span>;
            } else {
                gameLayout = <span>{ sides[0] }</span>;
            }

            var gameTitle = '';

            if(game.needsPassword) {
                gameTitle += '[Private] ';
            }

            if(game.gameType) {
                gameTitle += '[' + game.gameType + '] ';
            }

            gameTitle += game.name;

            return (
                <div key={ game.id } className='game-row'>
                    <div><b>{ gameTitle }</b>{ this.props.isAdmin && this.props.showNodes ? <span className='game-node'>Node: { game.node }</span> : null }</div>
                    { gameLayout }
                    <span className='pull-right'>
                        { (this.props.currentGame || _.size(game.players) === 2 || game.started) ?
                            null :
                            <button className='btn btn-primary' onClick={ event => this.joinGame(event, game) }>Join</button>
                        }
                        { this.canWatch(game) ?
                            <button className='btn btn-primary' onClick={ event => this.watchGame(event, game) }>Watch</button> : null }
                        { this.props.isAdmin ?
                            <button className='btn btn-primary' onClick={ event => this.removeGame(event, game) }>Remove</button> : null }
                    </span>
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

