import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

class Messages extends React.Component {
    componentDidUpdate() {
        $(this.refs.messagePanel).scrollTop(999999);
    }

    getMessage() {
        var messages = _.map(this.props.messages, message => {
            return <div className='message'>{message.message}</div>;
        });

        return messages;
    }

    render() {
        return (
            <div className='messages panel' ref='messagePanel'>
                {this.getMessage()}
            </div>);
    }
}

Messages.displayName = 'Messages';
Messages.propTypes = {
    messages: React.PropTypes.array
};

export default Messages;
