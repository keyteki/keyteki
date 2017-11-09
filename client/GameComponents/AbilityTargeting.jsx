import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

class AbilityTargeting extends React.Component {
    onMouseOver(event, card) {
        if(card && this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut(event, card) {
        if(card && this.props.onMouseOut) {
            this.props.onMouseOut(card);
        }
    }

    renderSimpleCard(card) {
        return (
            <div className='target-card vertical'
                onMouseOut={ event => this.onMouseOut(event, card) }
                onMouseOver={ event => this.onMouseOver(event, card) }>
                <img className='target-card-image vertical'
                    alt={ card.name }
                    src={ '/img/cards/' + (!card.facedown ? (card.id + '.jpg') : 'cardback.jpg') } />
            </div>);
    }
    
    renderSimpleRing(ring) {
        return (
            <div className='target-card vertical'>    
                <img className='target-card-image vertical'
                    alt={ ring.name }
                    src={ '/img/' + ring.conflictType + '-' + ring.element + '.png' } />
            </div>);
    }

    renderStringChoice(string) {
        return (
            <div className='target-card vertical'>    
                { string }
            </div>);
    }

    render() {
        let targetCards = _.map(this.props.targets, target => {
            return target.type === 'select' ? this.renderStringChoice(target.name) : target.type === 'ring' ? this.renderSimpleRing(target) : this.renderSimpleCard(target);
        });
        return (
            <div className='prompt-control-targeting'>
                { this.renderSimpleCard(this.props.source) }
                <span className='glyphicon glyphicon-arrow-right targeting-arrow' />
                { targetCards }
            </div>);
    }
}

AbilityTargeting.displayName = 'AbilityTargeting';
AbilityTargeting.propTypes = {
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    source: PropTypes.object,
    targets: PropTypes.array
};

export default AbilityTargeting;
