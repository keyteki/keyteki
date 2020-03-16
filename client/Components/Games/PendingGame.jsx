import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from 'jquery';

import Panel from '../Site/Panel';
import Messages from '../GameBoard/Messages';
import Avatar from '../Site/Avatar';
import SelectDeckModal from './SelectDeckModal';
import DeckStatus from '../Decks/DeckStatus';
import * as actions from '../../actions';

import { withTranslation, Trans } from 'react-i18next';

class PendingGame extends React.Component {
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

        this.notification = undefined;
    }

    componentDidMount() {
        this.props.loadDecks();

        if(this.props.currentGame && this.props.currentGame.gameFormat === 'sealed') {
            this.props.socket.emit('getsealeddeck', this.props.currentGame.id);
        }
    }

    componentWillReceiveProps(props) {
        if(!props.user) {
            return;
        }

        let players = this.getNumberOfPlayers(props);

        if(this.notification && this.state.playerCount === 1 && players === 2 && props.currentGame.owner === this.props.user.username) {
            let promise = this.notification.play();

            if(promise !== undefined) {
                promise.catch(() => {
                }).then(() => {
                });
            }

            if(window.Notification && Notification.permission === 'granted') {
                let otherPlayer = Object.values(props.currentGame.players).find(p => p.name !== props.user.username);
                let windowNotification = new Notification('Manacrest Online', { body: `${otherPlayer.name} has joined your game`, icon: `/img/avatar/${otherPlayer.username}.png` });

                setTimeout(() => windowNotification.close(), 5000);
            }
        }

        if(props.connecting) {
            this.setState({ waiting: false });
        }

        this.setState({ playerCount: players });
    }

    isGameReady() {
        if(!this.props.user) {
            return false;
        }

        if(!Object.values(this.props.currentGame.players).every(player => {
            return !!player.deck.selected;
        })) {
            return false;
        }

        return this.props.currentGame.owner === this.props.user.username;
    }

    onSelectDeckClick() {
        $('#decks-modal').modal('show');
    }

    selectDeck(deck) {
        $('#decks-modal').modal('hide');

        this.props.socket.emit('selectdeck', this.props.currentGame.id, deck._id);
    }

    getNumberOfPlayers(props) {
        return Object.values(props.currentGame.players).length;
    }

    getPlayerStatus(player, username) {
        let playerIsMe = player && player.name === username;

        let deck = null;
        let selectLink = null;
        let status = null;
        let isSealed = this.props.currentGame.gameFormat === 'sealed';

        if(player && player.deck && player.deck.selected && isSealed) {
            deck = <span className='deck-selection'>Sealed Deck Selected</span>;
        } else if(player && player.deck && player.deck.selected) {
            if(playerIsMe) {
                deck = <span className='deck-selection clickable' onClick={ this.onSelectDeckClick }>{ player.deck.name }</span>;
            } else {
                deck = <span className='deck-selection'><Trans>Deck Selected</Trans></span>;
            }

            status = <DeckStatus status={ player.deck.status } />;
        } else if(player && playerIsMe && !isSealed) {
            selectLink = <span className='card-link' onClick={ this.onSelectDeckClick }><Trans>Select deck...</Trans></span>;
        } else if(isSealed) {
            selectLink = <span><Trans>Sealed deck loading...</Trans></span>;
        }

        return (
            <div className='player-row' key={ player.name }>
                <Avatar username={ player.name } /><span>{ player.name }</span>{ deck } { status } { selectLink }
            </div>);
    }

    getGameStatus() {
        let t = this.props.t;


        if(this.props.connecting) {
            return t('Connecting to game server {{host}}', { host: this.props.host });
        }

        if(this.state.waiting) {
            return t('Waiting for lobby server...');
        }

        if(this.getNumberOfPlayers(this.props) < 2) {
            return t('Waiting for players...');
        }

        if(!Object.values(this.props.currentGame.players).every(player => {
            return !!player.deck.selected;
        })) {
            return t('Waiting for players to select decks');
        }

        if(this.props.currentGame.owner === this.props.user.username) {
            return t('Ready to begin, click start to begin the game');
        }

        return t('Ready to begin, waiting for opponent to start the game');
    }

    onLeaveClick(event) {
        event.preventDefault();

        this.props.leaveGame(this.props.currentGame.id);
    }

    onStartClick(event) {
        event.preventDefault();

        this.setState({ waiting: true });

        this.props.startGame(this.props.currentGame.id);
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
        let t = this.props.t;

        if(this.props.currentGame && this.props.currentGame.started) {
            return <div><Trans>Loading game in progress, please wait...</Trans></div>;
        }

        if(!this.props.user) {
            this.props.navigate('/');

            return <div><Trans>You must be logged in to play, redirecting...</Trans></div>;
        }

        return (
            <div>
                <audio ref={ ref => this.notification = ref }>
                    <source src='/sound/charge.mp3' type='audio/mpeg' />
                    <source src='/sound/charge.ogg' type='audio/ogg' />
                </audio>
                <Panel title={ this.props.currentGame.name }>
                    <div className='btn-group'>
                        <button className='btn btn-success' disabled={ !this.isGameReady() || this.props.connecting || this.state.waiting } onClick={ this.onStartClick }><Trans>Start</Trans></button>
                        <button className='btn btn-primary' onClick={ this.onLeaveClick }><Trans>Leave</Trans></button>
                    </div>
                    <div className='game-status'>{ this.getGameStatus() }</div>
                </Panel>
                <Panel title={ t('Players') }>
                    {
                        Object.values(this.props.currentGame.players).map(player => {
                            return this.getPlayerStatus(player, this.props.user.username);
                        })
                    }
                </Panel>
                <Panel title={ t('Spectators({{users}})', { users : this.props.currentGame.spectators.length }) }>
                    { this.props.currentGame.spectators.map(spectator => {
                        return <div key={ spectator.name }>{ spectator.name }</div>;
                    }) }
                </Panel>
                <Panel title={ t('Chat') }>
                    <div className='message-list'>
                        <Messages messages={ this.props.currentGame.messages } onCardMouseOver={ this.onMouseOver } onCardMouseOut={ this.onMouseOut } />
                    </div>
                    <form className='form form-hozitontal'>
                        <div className='form-group'>
                            <input className='form-control' type='text' placeholder={ t('Enter a message...') } value={ this.state.message }
                                onKeyPress={ this.onKeyPress } onChange={ this.onChange } />
                        </div>
                    </form>
                </Panel>
                <SelectDeckModal
                    apiError={ this.props.apiError }
                    decks={ this.props.decks }
                    id='decks-modal'
                    loading={ this.props.loading }
                    onDeckSelected={ this.selectDeck.bind(this) }
                    standaloneDecks={ this.props.standaloneDecks } />
            </div >);
    }
}

PendingGame.displayName = 'PendingGame';
PendingGame.propTypes = {
    apiError: PropTypes.string,
    connecting: PropTypes.bool,
    currentGame: PropTypes.object,
    decks: PropTypes.array,
    gameSocketClose: PropTypes.func,
    host: PropTypes.string,
    i18n: PropTypes.object,
    leaveGame: PropTypes.func,
    loadDecks: PropTypes.func,
    loadStandaloneDecks: PropTypes.func,
    loading: PropTypes.bool,
    navigate: PropTypes.func,
    sendSocketMessage: PropTypes.func,
    socket: PropTypes.object,
    standaloneDecks: PropTypes.array,
    startGame: PropTypes.func,
    t: PropTypes.func,
    user: PropTypes.object,
    zoomCard: PropTypes.func
};

function mapStateToProps(state) {
    return {
        apiError: state.api.message,
        connecting: state.games.connecting,
        currentGame: state.lobby.currentGame,
        decks: state.cards.decks,
        host: state.games.gameHost,
        loading: state.api.loading,
        socket: state.lobby.socket,
        standaloneDecks: state.cards.standaloneDecks,
        user: state.account.user
    };
}

export default withTranslation()(connect(mapStateToProps, actions)(PendingGame));
