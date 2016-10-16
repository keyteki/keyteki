import React from 'react';
import _ from 'underscore';

class Messages extends React.Component {
    getMessage() {
        var messages = _.map(this.props.messages, message => {
            return <div className='message'>{message.message}</div>;
        });

        return messages;
    }

    render() {
        return (
            <div className='messages panel'>
                {this.getMessage()}
            </div>);
    }
}

Messages.displayName = 'Messages';
Messages.propTypes = {
    messages: React.PropTypes.array
};

export default Messages;
