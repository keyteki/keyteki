import React from 'react';
import PropTypes from 'prop-types';

class Counter extends React.Component {
    render() {
        var className = 'counter ' + this.props.name;

        if(this.props.cancel) {
            className += ' cancel';
        }

        if(this.props.fade) {
            className += ' fade-out';
        }

        return (<div key={ this.props.name } className={ className }>
            { this.props.shortName ? <span>{ this.props.shortName }</span> : null }
            <span>{ this.props.value }</span>
        </div>);
    }
}

Counter.displayName = 'Counter';
Counter.propTypes = {
    cancel: PropTypes.bool,
    fade: PropTypes.bool,
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string,
    value: PropTypes.number
};

export default Counter;
