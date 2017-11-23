import React from 'react';
import PropTypes from 'prop-types';

class ChatControls extends React.Component {
    render() {
        return (
            <div className='chat-controls panel'>
                <button
                    className={ 'btn btn-transparent' + (this.props.showChatAlert ? ' with-alert' : '') }
                    onClick={ this.props.onToggleChatClick }
                >
                    <span className='glyphicon glyphicon-menu-hamburger' />
                    { window.innerWidth <= 1366 ? '' : ' Toggle Chat' }
                    <i className='glyphicon glyphicon-exclamation-sign'/>
                </button>
                <button className='btn btn-transparent' onClick={ this.props.onSettingsClick }>
                    <span className='glyphicon glyphicon-cog' />
                    { window.innerWidth <= 1366 ? '' : ' Settings' }
                </button>
            </div>
        );
    }
}

ChatControls.displayName = 'ChatControls';
ChatControls.propTypes = {
    onSettingsClick: PropTypes.func,
    onToggleChatClick: PropTypes.func,
    showChatAlert: PropTypes.bool
};

export default ChatControls;
