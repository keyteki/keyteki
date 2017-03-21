import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import moment from 'moment';

import * as actions from './actions';
import Avatar from './Avatar.jsx';

class InnerLobby extends React.Component {
    constructor() {
        super();

        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.state = {
            canScroll: true,
            message: ''
        };
    }

    componentDidUpdate() {
        if(this.state.canScroll) {
            $(this.refs.messages).scrollTop(999999);
        }
    }

    sendMessage() {
        if(this.state.message === '') {
            return;
        }

        this.props.socket.emit('lobbychat', this.state.message);

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

    onScroll() {
        var messages = this.refs.messages;

        setTimeout(() => {
            if(messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                this.setState({ canScroll: true });
            } else {
                this.setState({ canScroll: false });
            }
        }, 500);
    }

    render() {
        var index = 0;
        var messages = _.map(this.props.messages, message => {
            if(!message.user) {
                return;
            }

            var timestamp = moment(message.time).format('MMM Do H:mm:ss');
            return (
                <div key={timestamp + message.user.username + (index++).toString()}>
                    <Avatar emailHash={message.user.emailHash} float />
                    <span className='username'>{message.user.username}</span><span>{timestamp}</span>
                    <div className='message'>{message.message}</div>
                </div>);
        });

        var users = _.map(this.props.users, user => {
            return (
                <div>
                    <Avatar emailHash={user.emailHash} />
                    <span>{user.name}</span>
                </div>
            );
        });

        return (
            <div>
                { this.props.bannerNotice ? <div className='alert alert-danger'>{this.props.bannerNotice}</div> : null }
                <div className='alert alert-success'>
                    Apologies for the server instability over the last couple of days.  I have been working out the last of the issues with the big release last week.  It should be a lot better now. As always, please raise issues on <a href='https://github.com/cryogen/throneteki'>GitHub</a>.
                </div>
                <div className='alert alert-info'>
                    <div><span className='icon-intrigue' />2017-03-21: New cards: Jon Snow(WotW), The Dragon's Tail.  Fix Fealty, Ser Jaime Lannister, Selyse Baratheon, Eddard Stark.  Automatically populate the faction/agenda from a copy/pasted thronesdb decklist. </div>
                    <div><span className='icon-military' />2017-03-19: Implemented Alliance in the deck builder! New cards: King of Salt and Rock, Venomous Blade, Dragonglass Dagger(partial), Motley, Old Bear Mormont(WotW), The Seastone Chair, Bowen Marsh, Cotter Pyke, Stannis Baratheon(TIMC), Ser Denys Mallister, Ser Jaremy Rykker.  Fixed lobby chat to now keep trying to scroll to the bottom if you're scrolling it.  Fixed chat not being able to be scrolled with the mouse wheel</div>
                    <div><span className='icon-power' />2017-03-15: New cards: Golden Tooth, Ghiscari Elite, Ser Gregor Clegane, Jojen Reed, Maester of Starfall, First of the Men, The Boy King, Bear Island Host, The Prince's Pass, Mountains of the Moon, The Stone Drum, Vaes Tolorro, Tower of the Sun, Brandon's Gift, Tourney Grounds, King Beyond The Wall, Lannisport Treasury.  Fix Tinder Marge(sorry), various other minor fixes.</div>
                </div>
                <div className='row'>
                    <span className='col-sm-9 text-center'><h1>Play A Game Of Thrones 2nd Edition</h1></span>
                    <span className='col-sm-3 hidden-xs'><h3>{'Online Users (' + users.length + ')'}</h3></span>
                </div>
                <div className='row'>
                    <div className='lobby-chat col-sm-9'>
                        <div className='panel lobby-messages' ref='messages' onScroll={ this.onScroll }>
                            {messages}
                        </div>
                    </div>
                    <div className='panel user-list col-sm-3 hidden-xs'>
                        {users}
                    </div>
                </div>
                    <div className='row'>
                        <form className='form form-hozitontal'>
                            <div className='form-group'>
                                <div className='chat-box col-sm-5 col-xs-9'>
                                    <input className='form-control' type='text' placeholder='Chat...' value={this.state.message}
                                        onKeyPress={this.onKeyPress} onChange={this.onChange} />
                                </div>
                                <button type='button' className='btn btn-primary col-sm-1 col-xs-2' onClick={this.onSendClick}>Send</button>
                            </div>
                        </form>
                    </div>
            </div>);
    }
}

InnerLobby.displayName = 'Lobby';
InnerLobby.propTypes = {
    bannerNotice: React.PropTypes.string,
    messages: React.PropTypes.array,
    socket: React.PropTypes.object,
    users: React.PropTypes.array
};

function mapStateToProps(state) {
    return {
        bannerNotice: state.chat.notice,
        messages: state.chat.messages,
        socket: state.socket.socket,
        users: state.games.users
    };
}

const Lobby = connect(mapStateToProps, actions, null)(InnerLobby);

export default Lobby;
