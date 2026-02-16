import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import CardImage from './CardImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

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
            className='mb-2 h-[91px] w-[65px] shrink-0 overflow-hidden rounded-[6.25%] [&>canvas]:!h-full [&>canvas]:!w-full'
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
        <div className='flex flex-row items-center justify-center gap-2'>
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
