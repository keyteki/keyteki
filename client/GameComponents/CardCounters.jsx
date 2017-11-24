import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import Counter from './Counter.jsx';
import FateCounter from './FateCounter.jsx';
import HonorCounter from './HonorCounter.jsx';
import HonorStatusCounter from './HonorStatusCounter.jsx';

class CardCounters extends React.Component {
    render() {
        if(_.size(this.props.counters) === 0) {
            return null;
        }

        var countersClass = 'counters ignore-mouse-events';

        var counterDivs = _.map(this.props.counters, (counter, key) => {
            if(key === 'card-fate' || key === 'ring-fate') {
                return (<FateCounter key={ key } 
                    name={ key } 
                    value={ counter.count } 
                    fade={ counter.fade } 
                    cancel={ counter.cancel } 
                    shortName={ counter.shortName } />);
            }

            if(key === 'card-honor') {
                return (<HonorCounter key={ key } 
                    name={ key } 
                    value={ counter.count } 
                    fade={ counter.fade } 
                    cancel={ counter.cancel } 
                    shortName={ counter.shortName } />);
            }

            if(key === 'honor-status' && counter.count === 1) {
                return (<HonorStatusCounter key={ key } 
                    name={ key } 
                    value={ counter.count } 
                    honored
                    dishonored={ false }
                    fade={ counter.fade } 
                    cancel={ counter.cancel } 
                    shortName={ counter.shortName } />);
            }

            if(key === 'honor-status' && counter.count === 2) {
                return (<HonorStatusCounter key={ key } 
                    name={ key } 
                    value={ counter.count } 
                    honored={ false }
                    dishonored
                    fade={ counter.fade } 
                    cancel={ counter.cancel } 
                    shortName={ counter.shortName } />);
            }

            return (<Counter key={ key } 
                name={ key } 
                value={ counter.count } 
                fade={ counter.fade } 
                cancel={ counter.cancel } 
                shortName={ counter.shortName } />);
        });

        if(_.size(this.props.counters) > 3) {
            countersClass += ' many-counters';
        }

        return (
            <div className={ countersClass }>
                { counterDivs }
            </div>
        );
    }
}

CardCounters.displayName = 'CardCounters';
CardCounters.propTypes = {
    counters: PropTypes.object.isRequired
};

export default CardCounters;
