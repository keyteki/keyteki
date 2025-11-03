import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import CardImage from './CardImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

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
                    className='rounded-md shrink mb-2 vertical'
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
        <div className='flex items-center justify-center'>
            {renderSimpleCard(source)}
            {targetCards.length > 0 && <FontAwesomeIcon className='mx-2' icon={faArrowRight} />}
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
