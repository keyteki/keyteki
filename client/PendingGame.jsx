import React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import $ from 'jquery';
import _ from 'underscore';

import * as actions from './actions';
import DeckRow from './DeckRow.jsx';
import Messages from './GameComponents/Messages.jsx';
import Avatar from './Avatar.jsx';

class InnerPendingGame extends React.Component {
    constructor() {
        super();

        this.isGameReady = this.isGameReady.bind(this);
        this.onSelectDeckClick = this.onSelectDeckClick.bind(this);
        this.onLeaveClick = this.onLeaveClick.bind(this);
        this.onStartClick = this.onStartClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.onMouseOut = this.onMouseOver.bind(this);

        this.state = {
            playerCount: 1,
            decks: [],
            playSound: true,
            message: '',
            decksLoading: true,
            waiting: false
        };
    }

    componentDidMount() {
        $.ajax({
            url: '/api/decks',
            type: 'GET',
            cache: false
        }).done((data) => {
            if(!data.success) {
                this.setState({ error: data.message });
                return;
            }

            this.setState({ decks: data.decks, decksLoading: false });
        }).fail(() => {
            this.setState({ error: 'Could not communicate with the server.  Please try again later.', decksLoading: false });
        });
    }

    componentWillReceiveProps(props) {
        var players = _.size(props.currentGame.players);

        if(this.state.playerCount === 1 && players === 2 && props.currentGame.owner === this.props.username) {
            this.refs.notification.play();
        }

        if(props.connecting) {
            this.setState({ waiting: false });
        }

        this.setState({ playerCount: players });
    }

    componentDidUpdate() {
        $(this.refs.messagePanel).scrollTop(999999);
    }

    isGameReady() {
        if(!_.all(this.props.currentGame.players, player => {
            return !!player.deck.selected;
        })) {
            return false;
        }

        return this.props.currentGame.owner === this.props.username;
    }

    onSelectDeckClick() {
        $(findDOMNode(this.refs.modal)).modal('show');
    }

    selectDeck(index) {
        $(findDOMNode(this.refs.modal)).modal('hide');

        this.props.socket.emit('selectdeck', this.props.currentGame.id, this.state.decks[index]);
    }

    getPlayerStatus(player, username) {
        var playerIsMe = player && player.name === username;

        var deck = null;
        var selectLink = null;

        if(player && player.deck && player.deck.selected) {
            if(playerIsMe) {
                deck = <span className='deck-selection'>{player.deck.name}</span>;
                selectLink = <span className='deck-link' data-toggle='modal' data-target='#decks-modal'>Select deck...</span>;
            } else {
                deck = <span className='deck-selection'>Deck Selected</span>;
            }
        } else if(player && playerIsMe) {
            selectLink = <span className='deck-link' data-toggle='modal' data-target='#decks-modal'>Select deck...</span>;
        }

        return (
            <div className='player-row' key={player.name}>
                <Avatar emailHash={ player.emailHash } forceDefault={ player.settings ? player.settings.disableGravatar : false } /><span>{ player.name }</span>{ deck } { selectLink }
            </div>);
    }

    getGameStatus() {
        if(this.props.connecting) {
            return 'Connecting to game server: ' + this.props.host;
        }

        if(this.state.waiting) {
            return 'Waiting for lobby server...';
        }

        if(_.size(this.props.currentGame.players) < 2) {
            return 'Waiting for players...';
        }

        if(!_.all(this.props.currentGame.players, player => {
            return !!player.deck.selected;
        })) {
            return 'Waiting for players to select decks';
        }

        return 'Ready to begin, click start to begin the game';
    }

    onLeaveClick(event) {
        event.preventDefault();

        this.props.socket.emit('leavegame', this.props.currentGame.id);

        this.props.gameSocketClose();
    }

    onStartClick(event) {
        event.preventDefault();

        this.setState({ waiting: true });

        this.props.socket.emit('startgame', this.props.currentGame.id);
    }

    sendMessage() {
        if(this.state.message === '') {
            return;
        }

        this.props.sendSocketMessage('chat', this.state.message);

        this.setState({ message: '' });
    }

    onKeyPress(event) {
        if(event.key === 'Enter') {
            this.sendMessage();

            event.preventDefault();
        }
    }

    onSendClick(event) {
        event.preventDefault();

        this.sendMessage();
    }

    onChange(event) {
        this.setState({ message: event.target.value });
    }

    onMouseOver(card) {
        this.props.zoomCard(card);
    }

    render() {
        if(this.props.currentGame && this.props.currentGame.started) {
            return <div>Loading game in progress, please wait...</div>;
        }

        var index = 0;
        var decks = null;

        if(this.state.decksLoading) {
            decks = <div>Loading decks please wait...</div>;
        } else {
            decks = _.size(this.state.decks) > 0 ? _.map(this.state.decks, deck => {
                var row = <DeckRow key={deck.name + index.toString()} deck={deck} onClick={this.selectDeck.bind(this, index)} active={index === this.state.selectedDeck} />;

                index++;

                return row;
            }) : <div>You have no decks, please add one</div>;
        }

        var popup = (
            <div id='decks-modal' ref='modal' className='modal fade' tabIndex='-1' role='dialog'>
                <div className='modal-dialog' role='document'>
                    <div className='modal-content deck-popup'>
                        <div className='modal-header'>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>×</span></button>
                            <h4 className='modal-title'>Select Deck</h4>
                        </div>
                        <div className='modal-body'>
                            <div className='deck-list'>
                                {decks}
                            </div>
                        </div>
                    </div>
                </div>
            </div>);

        return (
            <div>
                <audio ref='notification'>
                    <source src='/sound/charge.mp3' type='audio/mpeg' />
                    <source src='/sound/charge.ogg' type='audio/ogg' />
                </audio>
                <div className='btn-group'>
                    <button className='btn btn-primary' disabled={!this.isGameReady() || this.props.connecting || this.state.waiting } onClick={this.onStartClick}>Start</button>
                    <button className='btn btn-primary' onClick={this.onLeaveClick}>Leave</button>
                </div>
                <h3>{this.props.currentGame.name}</h3>
                <div>{this.getGameStatus()}</div>
                <div className='players'>
                    <h3>Players</h3>
                    {
                        _.map(this.props.currentGame.players, player => {
                            return this.getPlayerStatus(player, this.props.username);
                        })
                    }
                </div>
                <div className='spectators'>
                    <h3>Spectators({this.props.currentGame.spectators.length})</h3>
                    {_.map(this.props.currentGame.spectators, spectator => {
                        return <div key={spectator.name}>{spectator.name}</div>;
                    })}
                </div>
                <div className='chat-box'>
                    <h3>Chat</h3>
                    <div className='message-list'>
                        <Messages messages={this.props.currentGame.messages} onCardMouseOver={this.onMouseOver} onCardMouseOut={this.onMouseOut} />
                    </div>
                        <form className='form form-hozitontal'>
                            <div className='form-group'>
                                <div className='col-sm-10'>
                                    <input className='form-control' type='text' placeholder='Chat...' value={this.state.message}
                                        onKeyPress={this.onKeyPress} onChange={this.onChange} />
                                </div>
                                <button type='button' className='btn btn-primary col-sm-2' onClick={this.onSendClick}>Send</button>
                            </div>
                        </form>
                </div>
                {popup}
            </div>);
    }
}

InnerPendingGame.displayName = 'PendingGame';
InnerPendingGame.propTypes = {
    cards: React.PropTypes.array,
    connecting: React.PropTypes.bool,
    currentGame: React.PropTypes.object,
    gameSocketClose: React.PropTypes.func,
    host: React.PropTypes.string,
    sendSocketMessage: React.PropTypes.func,
    socket: React.PropTypes.object,
    username: React.PropTypes.string,
    zoomCard: React.PropTypes.func
};

function mapStateToProps(state) {
    return {
        cards: state.cards.cards,
        connecting: state.socket.gameConnecting,
        currentGame: state.games.currentGame,
        host: state.socket.gameHost,
        socket: state.socket.socket,
        username: state.auth.username
    };
}

const PendingGame = connect(mapStateToProps, actions)(InnerPendingGame);

export default PendingGame;

