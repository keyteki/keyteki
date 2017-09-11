import React from 'react';

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
    cancel: React.PropTypes.bool,
    fade: React.PropTypes.bool,
    name: React.PropTypes.string.isRequired,
    shortName: React.PropTypes.string,
    value: React.PropTypes.number
};

export default Counter;
