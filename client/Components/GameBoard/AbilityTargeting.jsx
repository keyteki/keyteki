import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import CardImage from './CardImage';
import Icon from '../Icon';
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
            className='h-24 w-16 shrink-0 overflow-hidden rounded-[6.25%] [&>canvas]:!h-full [&>canvas]:!w-full'
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

    const count = props.targets.length;

    return (
        <div className='mb-2 flex w-full flex-row items-center gap-2'>
            {renderSimpleCard(props.source)}
            {count > 0 && <Icon icon={faArrowRight} />}
            {count > 0 && (
                <div className='ability-target-row' style={{ '--target-count': count }}>
                    {props.targets.map((target, index) => (
                        <React.Fragment key={target.uuid || index}>
                            {renderSimpleCard(target)}
                        </React.Fragment>
                    ))}
                </div>
            )}
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
