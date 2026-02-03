import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import CardImage from './CardImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import './AbilityTargetting.scss';

const AbilityTargeting = (props) => {
    const onMouseOver = useCallback(
        (card) => {
            if (card && props.onMouseOver) {
                props.onMouseOver(card);
            }
        },
        [props]
    );

    const onMouseOut = useCallback(
        (card) => {
            if (card && props.onMouseOut) {
                props.onMouseOut(card);
            }
        },
        [props]
    );

    const renderSimpleCard = (card) => (
        <div
            className='target-card vertical mb-2'
            onMouseOut={() => onMouseOut(card)}
            onMouseOver={() =>
                onMouseOver({
                    image: <CardImage card={{ ...card, facedown: false }} />,
                    size: 'normal'
                })
            }
        >
            <CardImage card={{ ...card, facedown: false }} />
        </div>
    );

    const targetCards = props.targets.map((target) => renderSimpleCard(target));

    return (
        <div className='prompt-control-targeting'>
            {renderSimpleCard(props.source)}
            {targetCards.length > 0 && <FontAwesomeIcon icon={faArrowRight} />}
            {targetCards}
        </div>
    );
};

AbilityTargeting.displayName = 'AbilityTargeting';
AbilityTargeting.propTypes = {
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    source: PropTypes.object,
    targets: PropTypes.array
};

export default AbilityTargeting;
