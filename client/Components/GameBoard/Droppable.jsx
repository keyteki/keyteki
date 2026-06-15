import classNames from 'classnames';
import React from 'react';
import { useDrop } from 'react-dnd';

import { ItemTypes } from '../../constants';

const validTargets = {
    hand: ['play area', 'discard', 'deck', 'archives', 'purged'],
    'play area': ['discard', 'hand', 'deck', 'archives', 'purged'],
    discard: ['archives', 'hand', 'deck', 'play area', 'purged'],
    archives: ['hand', 'deck', 'play area', 'discard', 'purged'],
    deck: ['hand', 'discard', 'archives', 'play area', 'purged'],
    purged: ['deck', 'play area', 'discard', 'hand', 'archives']
};

const Droppable = ({ children, manualMode, onDragDrop, source }) => {
    const [{ canDrop, isOver, itemSource }, drop] = useDrop({
        accept: ItemTypes.CARD,
        canDrop: (_, monitor) => {
            const item = monitor.getItem();

            if (manualMode) {
                return (
                    validTargets[item.source] &&
                    validTargets[item.source].some((target) => target === source)
                );
            }

            if (
                (item.source === 'hand' && source === 'play area') ||
                (item.source === 'hand' && source === 'discard')
            ) {
                return item.card.canPlay;
            }

            return false;
        },
        collect: (monitor) => {
            const item = monitor.getItem();

            return {
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
                itemSource: item && item.source
            };
        },
        drop: (_, monitor) => {
            const item = monitor.getItem();

            if (onDragDrop) {
                onDragDrop(item.card, item.source, source);
            }
        }
    });
    const className = classNames('overlay', {
        'drop-ok': isOver && canDrop,
        'no-drop': isOver && !canDrop && source !== itemSource,
        'can-drop': !isOver && canDrop,
        [source]: true
    });

    const dropClass = classNames('drop-target', {
        [source]: source !== 'play area'
    });

    return (
        <div className={dropClass} ref={drop}>
            <div className={className} />
            {children}
        </div>
    );
};

export default Droppable;
