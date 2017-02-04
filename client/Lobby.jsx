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

        this.state = {
            message: ''
        };
    }

    componentDidUpdate() {
        $(this.refs.messages).scrollTop(999999);
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
                <div className='alert alert-info'>
                    <div><span className='icon-power' />2017-02-04: New cards: Harrenhal(FFH), Tower of the Hand, House Manderly Knight, "Wolf in the Night", Relentless Assault, Sea Bitch, Quaithe of the Shadow, Small Council Chamber, Varys, A Gift Of Arbor Red.  Various fixes including Fiery Followers</div>
                    <div><span className='icon-intrigue' />2017-02-02: Fix: cards with persistent effects, Areo Hotah, Davos Seaworth, Maester Caleotte.  Limit accounts to only be able to be in one game at once, playing or spectating.  Attempt to fix some of the sticky game/disconnect issues.  Please bear with me while I try to fix these issues, they're very difficult to replicate.  If you have more information on how they occur please raise an issue or let me know</div>
                    <div><span className='icon-military' />2017-01-31: New cards: Harmen Uller, Mance Rayder, Raider from Pyke, The Wolfswood</div>
                </div>
                <div className='row'>
                    <span className='col-sm-9 text-center'><h1>Play A Game Of Thrones 2nd Edition</h1></span>
                    <span className='col-sm-3 hidden-xs'><h3>{'Online Users (' + users.length + ')'}</h3></span>
                </div>
                <div className='row'>
                    <div className='lobby-chat col-sm-9'>
                        <div className='panel lobby-messages' ref='messages'>
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
    messages: React.PropTypes.array,
    socket: React.PropTypes.object,
    users: React.PropTypes.array
};

function mapStateToProps(state) {
    return {
        messages: state.chat.messages,
        socket: state.socket.socket,
        users: state.games.users
    };
}

const Lobby = connect(mapStateToProps, actions, null)(InnerLobby);

export default Lobby;
