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
            <img className='counterimage' src={ '/img/' + this.props.name.toLowerCase() + '.png' } title={ this.props.name } />
            <div className='countertext'> { this.props.value ? this.props.value : null } </div>
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
