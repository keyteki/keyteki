import React from 'react';

class Counter extends React.Component {
    render() {
        if((!this.props.count || this.props.count === 0) && !this.props.displayIfNoCount) {
            return null;
        }

        var className = 'counter ' + this.props.name;

        if(this.props.cancel) {
            className += ' cancel';
        }
        
        return (<div key={ this.props.name } className={ className }>
            <span>{ this.props.count }</span>
        </div>);
    }
}

Counter.displayName = 'Counter';
Counter.propTypes = {
    cancel: React.PropTypes.bool,
    count: React.PropTypes.number,
    displayIfNoCount: React.PropTypes.bool,
    fade: React.PropTypes.bool,
    name: React.PropTypes.string.isRequired
};

export default Counter;
