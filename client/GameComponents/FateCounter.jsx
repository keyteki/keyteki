import React from 'react';
import PropTypes from 'prop-types';

import Counter from './Counter.jsx';

class FateCounter extends Counter {
    render() {
        var className = 'fatecounter ' + this.props.name;

        if(this.props.cancel) {
            className += ' cancel';
        }

        if(this.props.fade) {
            className += ' fade-out';
        }
        
        return (<div key={ this.props.name } className={ className }>
            <img src='/img/Fate.png' title='Fate' alt='Fate' />
            <div className='fatecountertext'> { this.props.value } </div>
        </div>);
    }
}

FateCounter.displayName = 'FateCounter';
FateCounter.propTypes = {
    cancel: PropTypes.bool,
    fade: PropTypes.bool,
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string,
    value: PropTypes.number
};

export default FateCounter;
