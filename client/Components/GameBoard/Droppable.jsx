import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';

import { ItemTypes } from '../../constants';

import './Droppable.scss';

const validTargets = {
    hand: ['play area', 'discard', 'deck', 'archives', 'purged'],
    'play area': ['discard', 'hand', 'deck', 'archives', 'purged'],
    discard: ['archives', 'hand', 'deck', 'play area', 'purged'],
    archives: ['hand', 'deck', 'play area', 'discard', 'purged'],
    deck: ['hand', 'discard', 'archives', 'play area', 'purged'],
    purged: ['deck', 'play area', 'discard', 'hand', 'archives']
};

const dropTarget = {
    canDrop(props, monitor) {
        let item = monitor.getItem();

        if (props.manualMode) {
            return (
                validTargets[item.source] &&
                validTargets[item.source].some((target) => target === props.source)
            );
        }

        if (
            (item.source === 'hand' && props.source === 'play area') ||
            (item.source === 'hand' && props.source === 'discard')
        ) {
            return item.card.canPlay;
        }

        return false;
    },
    drop(props, monitor) {
        let item = monitor.getItem();

        if (props.onDragDrop) {
            props.onDragDrop(item.card, item.source, props.source);
        }
    }
};

function collect(connect, monitor) {
    let item = monitor.getItem();

    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        itemSource: item && item.source
    };
}

class Droppable extends React.Component {
    render() {
        let className = classNames('overlay', {
            'drop-ok': this.props.isOver && this.props.canDrop,
            'no-drop':
                this.props.isOver &&
                !this.props.canDrop &&
                this.props.source !== this.props.itemSource,
            'can-drop': !this.props.isOver && this.props.canDrop
        });

        return this.props.connectDropTarget(
            <div className='drop-target'>
                <div className={className} />
                {this.props.children}
            </div>
        );
    }
}

Droppable.propTypes = {
    canDrop: PropTypes.bool,
    children: PropTypes.node,
    connectDropTarget: PropTypes.func,
    isOver: PropTypes.bool,
    itemSource: PropTypes.string,
    manualMode: PropTypes.bool,
    onDragDrop: PropTypes.func,
    source: PropTypes.string.isRequired
};

export default DropTarget(ItemTypes.CARD, dropTarget, collect)(Droppable);
