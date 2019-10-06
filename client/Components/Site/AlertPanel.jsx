import React from 'react';
import PropTypes from 'prop-types';

class AlertPanel extends React.Component {
    render() {
        let icon = 'glyphicon';
        let alertClass = 'alert fade in';

        switch(this.props.type) {
            case 'warning':
                icon += ' glyphicon-warning-sign';
                alertClass += ' alert-warning';
                break;
            case 'error':
                icon += ' glyphicon-exclamation-sign';
                alertClass += ' alert-danger';
                break;
            case 'info':
                icon += ' glyphicon-info-sign';
                alertClass += ' alert-info';
                break;
            case 'success':
                icon += ' glyphicon-ok-sign';
                alertClass += ' alert-success';
                break;
        }

        if(this.props.multiLine) {
            alertClass += ' multiline';
        }

        return (<div ref='alertPanel' className={ alertClass } role='alert'>
            { !this.props.noIcon && <span id='alert-icon' className={ icon } aria-hidden='true' /> }
            { this.props.title && <span id='alert-title' className='sr-only'>{ this.props.title }</span> }
            { this.props.message && <span id='alert-message'>&nbsp;{ this.props.message }</span> }
            { this.props.children && <span>&nbsp;{ this.props.children }</span> }
        </div>);
    }
}

AlertPanel.displayName = 'AlertPanel';
AlertPanel.propTypes = {
    children: PropTypes.any,
    message: PropTypes.string,
    multiLine: PropTypes.bool,
    noIcon: PropTypes.bool,
    title: PropTypes.string,
    type: PropTypes.oneOf(['warning', 'info', 'success', 'error'])
};
AlertPanel.defaultProps = {
    type: 'info'
};

export default AlertPanel;
