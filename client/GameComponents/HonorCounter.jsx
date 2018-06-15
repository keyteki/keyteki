import React from 'react';
import PropTypes from 'prop-types';

import Counter from './Counter.jsx';

class HonorCounter extends Counter {
    render() {
        var className = 'honorcounter ' + this.props.name;

        if(this.props.cancel) {
            className += ' cancel';
        }

        if(this.props.fade) {
            className += ' fade-out';
        }
        
        return (<div key={ this.props.name } className={ className }>
            <img src='/img/Honor.png' title='Honor' alt='Honor' />
            <div className='honorcountertext'> { this.props.value } </div>
        </div>);
    }
}

HonorCounter.displayName = 'HonorCounter';
HonorCounter.propTypes = {
    cancel: PropTypes.bool,
    fade: PropTypes.bool,
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string,
    value: PropTypes.number
};

export default HonorCounter;
