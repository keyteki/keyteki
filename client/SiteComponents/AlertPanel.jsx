import React from 'react';

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

        return (<div className={ alertClass } ref='alertPanel' role='alert'>
                    <span className={ icon } aria-hidden='true' />
                    <span className='sr-only'>{ this.props.title }</span>
                    &nbsp;{ this.props.message }
                    &nbsp;{ this.props.children }
                </div>);        
    }
}

AlertPanel.displayName = 'AlertPanel';
AlertPanel.propTypes = {
    children: React.PropTypes.any,
    message: React.PropTypes.string,
    title: React.PropTypes.string,
    type: React.PropTypes.oneOf(['warning', 'info', 'success', 'error'])
};

export default AlertPanel;
