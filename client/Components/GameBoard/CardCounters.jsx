import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Counter from './Counter';

class CardCounters extends React.Component {
    render() {
        if(this.props.counters.length === 0) {
            return null;
        }

        let countersClass = classNames('counters', 'ignore-mouse-events', {
            'many-counters': this.props.counters.length > 3
        });

        let counterDivs = [];

        for(const [key, counter] of Object.entries(this.props.counters)) {
            counterDivs.push(<Counter key={ key }
                name={ counter.name }
                icon={ counter.icon }
                value={ counter.count }
                fade={ counter.fade }
                cancel={ counter.cancel }
                shortName={ counter.shortName } />);
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
    counters: PropTypes.array.isRequired
};

export default CardCounters;
