import React from 'react';
import {connect} from 'react-redux';
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

        this.props.socket.emit('joingame', game.id);
    }

    canWatch(game) {
        return !this.props.currentGame && game.allowSpectators;
    }

    watchGame(event, game) {
        event.preventDefault();

        this.props.socket.emit('watchgame', game.id);
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
                        <span><Avatar emailHash={ player.emailHash } /></span>
                        <span className='player-name'>{ player.name }</span>
                        <span className={' game-icon icon-' + player.faction} />
                    </span>);

                    firstPlayer = false;
                } else {
                    playerElement = (
                    <span>
                        <span className={' game-icon icon-' + player.faction} />
                        <span className='player-name'>{ player.name }</span>
                        <span><Avatar emailHash={player.emailHash} /></span>
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

            return (
                <div key={ game.id } className='game-row'>
                    <div><b>[{ game.gameType }] { game.name }</b>{ this.props.isAdmin && this.props.showNodes ? <span className='game-node'>Node: { game.node }</span> : null}</div>
                    { gameLayout }
                    <span className='pull-right'>
                        { (this.props.currentGame || _.size(game.players) === 2 || game.started) ?
                            null :
                            <button className='btn btn-primary' onClick={ event => this.joinGame(event, game) }>Join</button>
                        }
                        {this.canWatch(game) ?
                            <button className='btn btn-primary' onClick={event => this.watchGame(event, game)}>Watch</button> : null}
                        {this.props.isAdmin ?
                            <button className='btn btn-primary' onClick={event => this.removeGame(event, game)}>Remove</button> : null}
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
    joinGame: React.PropTypes.func,
    showNodes: React.PropTypes.bool,
    socket: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentGame: state.games.currentGame,
        isAdmin: state.auth.isAdmin,
        socket: state.socket.socket
    };
}

const GameList = connect(mapStateToProps, actions)(InnerGameList);

export default GameList;

