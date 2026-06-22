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
            className='ability-targeting-card'
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
        <div className='ability-targeting'>
            <div className='ability-targeting-source'>
                {renderSimpleCard(props.source)}
                {count > 0 && <Icon icon={faArrowRight} />}
            </div>
            {count > 0 && (
                <div className={`ability-targeting-targets${count > 1 ? ' flex-1' : ''}`}>
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
