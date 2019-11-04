import React from 'react';
import PropTypes from 'prop-types';
import CardImage from './CardImage';

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
                <CardImage className='target-card-image vertical'
                    alt={ card.name }
                    img={ !card.facedown ? (`/img/cards/${card.image}.png`) : '/img/idbacks/cardback.jpg' }
                    maverick={ card.maverick }
                    anomaly={ card.anomaly }
                    amber={ card.cardPrintedAmber }/>

            </div>);
    }

    render() {
        let targetCards = this.props.targets.map(target => this.renderSimpleCard(target));
        return (
            <div className='prompt-control-targeting'>
                { this.renderSimpleCard(this.props.source) }
                { targetCards.length > 0 && <span className='glyphicon glyphicon-arrow-right targeting-arrow' /> }
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
