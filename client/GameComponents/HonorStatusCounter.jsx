import React from 'react';
import PropTypes from 'prop-types';

import Counter from './Counter.jsx';

class HonorStatusCounter extends Counter {
    render() {
        var className = 'honorstatuscounter ' + this.props.name;

        if(this.props.cancel) {
            className += ' cancel';
        }

        if(this.props.fade) {
            className += ' fade-out';
        }
        
        return (<div key={ this.props.name } className={ className }>
            { this.props.honored ? <img src='/img/honor-stone.png' title='Honored' alt='Honored' /> : null }
            { this.props.dishonored ? <img src='/img/dishonor-stone.png' title='Dishonored' alt='Dishonored' /> : null }
        </div>);
    }
}

HonorStatusCounter.displayName = 'HonorStatusCounter';
HonorStatusCounter.propTypes = {
    cancel: PropTypes.bool,
    dishonored: PropTypes.bool,
    fade: PropTypes.bool,
    honored: PropTypes.bool,
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string,
    value: PropTypes.number
};

export default HonorStatusCounter;
