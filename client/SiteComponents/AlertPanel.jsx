import React from 'react';
import PropTypes from 'prop-types';

class AlertPanel extends React.Component {
    render() {
        var icon = 'glyphicon';
        var alertClass = 'alert fade in';

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

        return (<div ref='alertPanel' className={ alertClass } role='alert'>
            { this.props.noIcon ? null : <span className={ icon } aria-hidden='true' /> }
            { this.props.title ? <span className='sr-only'>{ this.props.title }</span> : null }
            &nbsp;{ this.props.message }
            &nbsp;{ this.props.children }
        </div>);
    }
}

AlertPanel.displayName = 'AlertPanel';
AlertPanel.propTypes = {
    children: PropTypes.any,
    message: PropTypes.string,
    noIcon: PropTypes.bool,
    title: PropTypes.string,
    type: PropTypes.oneOf(['warning', 'info', 'success', 'error'])
};

export default AlertPanel;
