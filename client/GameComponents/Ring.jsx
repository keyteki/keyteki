const _ = require('underscore');

import React from 'react';
import PropTypes from 'prop-types';

import CardCounters from './CardCounters.jsx';

class Ring extends React.Component {
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
    }

    onClick(event, ring) {
        event.preventDefault();
        event.stopPropagation();

        if(this.props.onClick) {
            this.props.onClick(ring);
        }
    }

    getCountersForRing(ring) {
        var counters = {};

        counters['ring-fate'] = this.props.ring.fate ? { count: this.props.ring.fate, shortName: 'F' } : undefined;

        _.each(ring.tokens, (token, key) => {
            counters[key] = { count: token, fade: ring.type === 'attachment', shortName: this.shortNames[key] };
        });

        var filteredCounters = _.omit(counters, counter => {
            return _.isUndefined(counter) || _.isNull(counter) || counter < 0;
        });

        return filteredCounters;
    }

    showCounters() {
        return true;
    }

    render() {

        return (<div className='ring-display'>
            <div className='ring' onClick={ event => this.onClick(event, this.props.ring.element) } >
                <img className='ring' title={ this.props.ring.element } src={ '/img/' + this.props.ring.conflictType + '-' + this.props.ring.element + '.png' } />
                { this.showCounters() ? <CardCounters counters={ this.getCountersForRing(this.props.ring.element) } /> : null }
            </div>
            <div className={ this.props.ring.claimedBy.length > 12 ? 'ring-info-xs ' : 'ring-info ' } >
                { this.props.ring.claimed ? 'Claimed: ' + this.props.ring.claimedBy : this.props.ring.contested ? 'Contested' : 'Unclaimed' }
            </div>
        </div>);
    }
}

Ring.displayName = 'Ring';
Ring.propTypes = {
    buttons: PropTypes.array,
    onClick: PropTypes.func,
    ring: PropTypes.object,
    socket: PropTypes.object
};

export default Ring;
