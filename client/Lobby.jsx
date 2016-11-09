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
        if (this.state.message === '') {
            return;
        }

        this.props.socket.emit('lobbychat', this.state.message);

        this.setState({ message: '' });
    }

    onKeyPress(event) {
        if (event.key === 'Enter') {
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
        var messages = _.map(this.props.messages, message => {
            var timestamp = moment(message.time).format('MMM Do H:mm:ss');
            return (
                <div key={timestamp + message.user.username}>
                    <img className='avatar pull-left' />
                    <span className='username'>{message.user.username}</span><span>{timestamp}</span>
                    <div className='message'>{message.message}</div>
                </div>);
        });
        return (
            <div ref='lala'>
                <h1>Play A Game Of Thrones 2nd Edition</h1>
                <div className='lobby-chat col-sm-10'>
                    <div className='panel lobby-messages' ref='messages'>
                        {messages}
                    </div>
                    <div>
                        <form className='form form-hozitontal'>
                            <div className='form-group'>
                                <div className='col-sm-7'>
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
