import React from 'react';
import PropTypes from 'prop-types';

class Controls extends React.Component {
    render() {
        const laptopSize = window.innerWidth <= 1366;

        return (
            <div className='controls panel'>
                <button
                    className={ 'btn btn-transparent' + (this.props.showChatAlert ? ' with-alert' : '') }
                    onClick={ this.props.onToggleChatClick }
                >
                    <span className='glyphicon glyphicon-menu-hamburger' />
                    { laptopSize ? '' : ' Toggle Chat' }
                    <i className='glyphicon glyphicon-exclamation-sign'/>
                </button>
                {
                    this.props.showManualMode &&
                    <button
                        className={ 'btn btn-transparent ' + (this.props.manualModeEnabled ? 'manual' : 'auto') }
                        onClick={ this.props.onManualModeClick }
                    >
                        <span className='glyphicon glyphicon-wrench' />
                        { laptopSize ? '' : ' Manual Mode ' + (this.props.manualModeEnabled ? ' Enabled' : 'Disabled') }
                    </button>
                }
                <button className='btn btn-transparent' onClick={ this.props.onSettingsClick }>
                    <span className='glyphicon glyphicon-cog' />
                    { laptopSize ? '' : ' Settings' }
                </button>
            </div>
        );
    }
}

Controls.displayName = 'Controls';
Controls.propTypes = {
    manualModeEnabled: PropTypes.bool,
    onManualModeClick: PropTypes.func,
    onSettingsClick: PropTypes.func,
    onToggleChatClick: PropTypes.func,
    showChatAlert: PropTypes.bool,
    showManualMode: PropTypes.bool
};

export default Controls;
