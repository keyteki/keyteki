import React from 'react';
import PropTypes from 'prop-types';
import CardImage from './CardImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import './AbilityTargetting.scss';

class AbilityTargeting extends React.Component {
    onMouseOver(event, card) {
        if (card && this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut(event, card) {
        if (card && this.props.onMouseOut) {
            this.props.onMouseOut(card);
        }
    }

    renderSimpleCard(card) {
        return (
            <div
                className='target-card vertical mb-2'
                onMouseOut={(event) => this.onMouseOut(event, card)}
                onMouseOver={(event) => this.onMouseOver(event, card)}
            >
                <CardImage card={card} />
            </div>
        );
    }

    render() {
        let targetCards = this.props.targets.map((target) => this.renderSimpleCard(target));
        return (
            <div className='prompt-control-targeting'>
                {this.renderSimpleCard(this.props.source)}
                {targetCards.length > 0 && <FontAwesomeIcon icon={faArrowRight} />}
                {targetCards}
            </div>
        );
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
