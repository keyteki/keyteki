import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import moment from 'moment';

import * as actions from './actions';

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
                    <img className='avatar pull-left' />
                    <span className='username'>{message.user.username}</span><span>{timestamp}</span>
                    <div className='message'>{message.message}</div>
                </div>);
        });
        return (
            <div>
                <div className='alert alert-info col-sm-8'>The site is in beta.  You will encounter bugs or missing features.  Please report these issues to&nbsp;
             <a href='https://www.github.com/cryogen/throneteki' target='_blank'>GitHub</a>.</div>
                <div className='alert alert-success col-sm-8'>Avatars are now in use in various parts of the site(more coming soon).  If you want your own rather than the default, see <a href='https://en.gravatar.com/'>Gravatar</a></div>
                <div className='row' />
                <h1 className='col-sm-12'>Play A Game Of Thrones 2nd Edition</h1>
                <div className='lobby-chat col-sm-8'>
                    <div className='panel lobby-messages' ref='messages'>
                        {messages}
                    </div>
                    <div>
                        <form className='form form-hozitontal'>
                            <div className='form-group'>
                                <div className='col-sm-11'>
                                    <input className='form-control' type='text' placeholder='Chat...' value={this.state.message}
                                        onKeyPress={this.onKeyPress} onChange={this.onChange} />
                                </div>
                                <button type='button' className='btn btn-primary col-sm-1' onClick={this.onSendClick}>Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>);
    }
}

InnerLobby.displayName = 'Lobby';
InnerLobby.propTypes = {
    messages: React.PropTypes.array,
    socket: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        messages: state.chat.messages,
        socket: state.socket.socket
    };
}

const Lobby = connect(mapStateToProps, actions, null)(InnerLobby);

export default Lobby;
