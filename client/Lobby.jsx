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
                    <div><span className='icon-military' />2017-01-13: New cards: Muster The Realm, Wardens of the West, The King's Peace, Wardens of the North, The First Snow of Winter.  Fixed Redcloaks, 0 STR challenges.  Also fix effects that occur after a challenge winner is determined from affecting the result of a challenge.  Fix selection highlights 'sticking'.  Fix the Tickler triggering for the wrong person.  Added an action window before the first challenge can be declared.</div>
                    <div><span className='icon-power' />2017-01-10: New cards: Winter Festival, The Boneway, Yoren, Brienna of Tarth, Roose Bolton, Offer of a Peach, The Frostfangs, Frozen Solid, Hedge Knight, Night Gathers...  Fixed tokens placed by Tears of Lys not being removed correctly, fixed Jory Cassel triggering incorrectly, fix Wildling Horde not being triggerable as a defender.  Added logging of games for statistical purposes.  I hope to use this data to provide stats on what factions people are playing and things of that nature.  Watch out for reports on them in the future!</div>                
                    <div><span className='icon-intrigue' />2017-01-09: New cards: Mare in Heat, Silver Steed, Stinking Drunk, Paid Off, Consolidation of Power, Ours is the Fury, We Do Not Sow, Hear Me Roar!, The Things I Do For Love, Doran's Game, Unbowed Unbent Unbroken, Confinement, Gates Of Winterfell, Harrenhal (GoH).  Fixed: The wall triggering when it is knelt and not boosting cards that are put into play, Eddard Stark gaining power instead of selected card, Euron Crow's Eye and other take control effects when controller cards go out of play.  Added a highlight for cards that are currently participating in a challenge</div> 
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
