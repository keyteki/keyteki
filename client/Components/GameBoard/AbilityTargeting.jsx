import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import CardImage from './CardImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import './AbilityTargetting.scss';

const AbilityTargeting = ({ source, targets, onMouseOver, onMouseOut }) => {
    const handleMouseOver = useCallback(
        (event, card) => {
            if (card && onMouseOver) {
                onMouseOver(card);
            }
        },
        [onMouseOver]
    );

    const handleMouseOut = useCallback(
        (event, card) => {
            if (card && onMouseOut) {
                onMouseOut(card);
            }
        },
        [onMouseOut]
    );

    const renderSimpleCard = useCallback(
        (card) => {
            return (
                <div
                    className='target-card vertical mb-2'
                    onMouseOut={(event) => handleMouseOut(event, card)}
                    onMouseOver={(event) =>
                        handleMouseOver(event, {
                            image: <CardImage card={{ ...card, facedown: false }} />,
                            size: 'normal'
                        })
                    }
                >
                    <CardImage card={{ ...card, facedown: false }} />
                </div>
            );
        },
        [handleMouseOver, handleMouseOut]
    );

    const targetCards = targets.map((target) => renderSimpleCard(target));

    return (
        <div className='prompt-control-targeting'>
            {renderSimpleCard(source)}
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
