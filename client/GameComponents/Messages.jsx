import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';

import * as actions from '../actions';

class InnerMessages extends React.Component {
    constructor() {
        super();

        this.onKeyPress = this.onKeyPress.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            message: ''
        };
    }

    componentDidUpdate() {
        $(this.refs.messagePanel).scrollTop(999999);
    }

    getMessage() {
        var index = 0;
        var messages = _.map(this.props.messages, message => {
            return <div key={'message'+index++} className='message'>{message.message}</div>;
        });

        return messages;
    }

    sendMessage() {
        if(this.state.message === '') {
            return;
        }

        this.props.socket.emit('chat', this.state.message);

        this.setState({ message: '' });
    }

    onChange(event) {
        this.setState({ message: event.target.value });
    }

    onKeyPress(event) {
        if(event.key === 'Enter') {
            this.sendMessage();

            event.preventDefault();
        }
    }

    render() {
        return (
            <div className='chat'>
                <div className='messages panel' ref='messagePanel'>
                    {this.getMessage()}
                </div>
                <form>
                    <input className='form-control' placeholder='Chat...' onKeyPress={this.onKeyPress} onChange={this.onChange}
                        value={this.state.message} />
                </form>
            </div>);
    }
}

InnerMessages.displayName = 'Messages';
InnerMessages.propTypes = {
    messages: React.PropTypes.array,
    socket: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket
    };
}

const Messages = connect(mapStateToProps, actions)(InnerMessages);

export default Messages;

