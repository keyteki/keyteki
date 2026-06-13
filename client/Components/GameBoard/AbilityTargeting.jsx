import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import Icon from '../Icon';
import CardImage from './CardImage';

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

    const renderSimpleCard = (card, style) => (
        <div
            className='h-24 w-16 shrink-0 overflow-hidden rounded-[6.25%] [&>canvas]:!h-full [&>canvas]:!w-full'
            style={style}
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
    // Overlap margin: spread cards across available width, overlapping when
    // they don't fit. 100% = parent width, 4rem = card width (w-16).
    const overlapMargin =
        count > 1 ? { marginLeft: `calc((100% - ${count} * 4rem) / ${count - 1})` } : undefined;

    return (
        <div className='mb-2 flex w-full flex-row items-center gap-2'>
            {renderSimpleCard(props.source)}
            {count > 0 && <Icon icon={faArrowRight} />}
            {count > 0 && (
                <div className='flex min-w-0 flex-1 flex-row items-center'>
                    {props.targets.map((target, index) => (
                        <React.Fragment key={target.uuid || index}>
                            {renderSimpleCard(target, index > 0 ? overlapMargin : undefined)}
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
