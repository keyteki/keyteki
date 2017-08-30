const _ = require('underscore');

import React from 'react';

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

        counters['ring-fate'] = ring.fate ? { count: ring.fate, fade: ring.type === 'attachment', shortName: 'F' } : undefined;

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

        return (<div>
            <div className='ring' onClick={ event => this.onClick(event, this.props.ringType) } >
                <img className='ring' src={ '/img/' + this.props.conflictType + '-' + this.props.ringType + '.png' } />
                { this.showCounters() ? <CardCounters counters={ this.getCountersForRing(this.props.ringType) } /> : null }
            </div>
            <div className='ring-claim' >
                {this.props.claimed ? 'Claimed By ' + this.props.claimedBy : 'Unclaimed' }
            </div>
        </div>);
    }
}

Ring.displayName = 'Ring';
Ring.propTypes = {
    buttons: React.PropTypes.array,
    claimed: React.PropTypes.bool,
    claimedBy: React.PropTypes.string,
    conflictType: React.PropTypes.string,
    fate: React.PropTypes.number,
    onClick: React.PropTypes.func,
    ringType: React.PropTypes.string,
    socket: React.PropTypes.object
};

export default Ring;
