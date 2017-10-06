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

        counters['ring-fate'] = this.props.fate ? { count: this.props.fate, shortName: 'F' } : undefined;

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
            <div className='ring' onClick={ event => this.onClick(event, this.props.ringType) } >
                <img className='ring' title={ this.props.ringType } src={ '/img/' + this.props.conflictType + '-' + this.props.ringType + '.png' } />
                { this.showCounters() ? <CardCounters counters={ this.getCountersForRing(this.props.ringType) } /> : null }
            </div>
            <div className={ this.props.claimedBy.length > 12 ? 'ring-info-xs ' : 'ring-info ' } >
                { this.props.claimed ? 'Claimed: ' + this.props.claimedBy : 'Unclaimed' }
            </div>
        </div>);
    }
}

Ring.displayName = 'Ring';
Ring.propTypes = {
    buttons: PropTypes.array,
    claimed: PropTypes.bool,
    claimedBy: PropTypes.string,
    conflictType: PropTypes.string,
    fate: PropTypes.number,
    onClick: PropTypes.func,
    ringType: PropTypes.string,
    socket: PropTypes.object
};

export default Ring;
