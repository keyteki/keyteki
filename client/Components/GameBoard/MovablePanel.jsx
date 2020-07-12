import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { ItemTypes } from '../../constants';
import PopupDefaults from './PopupDefaults';

import './MovablePanel.scss';

const panelSource = {
    beginDrag(props) {
        return {
            name: `${props.name}-${props.side}`
        };
    },
    endDrag(props, monitor) {
        const offset = monitor.getSourceClientOffset();
        const style = {
            left: offset.x,
            top: offset.y,
            position: 'fixed'
        };

        localStorage.setItem(`${props.name}-${props.side}`, JSON.stringify(style));
    }
};

function collect(connect, monitor) {
    return {
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        dragOffset: monitor.getSourceClientOffset()
    };
}

class MovablePanel extends React.Component {
    constructor(props) {
        super(props);

        const key = `${props.name}-${props.side}`;
        const savedStyle = localStorage.getItem(key);
        const style = (savedStyle && JSON.parse(savedStyle)) || PopupDefaults[key];

        this.state = {
            position: Object.assign({}, style)
        };
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(props) {
        if (props.isDragging) {
            let style = {
                position: 'fixed',
                left: Math.max(props.dragOffset.x, 0),
                top: Math.max(props.dragOffset.y, 50)
            };

            const popup = $(this.popup);

            if (style.left + popup.width() > window.innerWidth) {
                style.left = window.innerWidth - popup.width();
            }

            if (style.top + popup.height() > window.innerHeight) {
                style.top = window.innerHeight - popup.height();
            }

            this.setState({
                position: style
            });
        }
    }

    render() {
        let style = this.state.position;

        let content = (
            <div ref={(p) => (this.popup = p)} className='panel panel-primary' style={style}>
                {this.props.connectDragSource(
                    <div className='panel-heading' onClick={(event) => event.stopPropagation()}>
                        <span className='text-center'>{this.props.title}</span>
                        <span className='float-right'>
                            <a className='close-button' onClick={this.props.onCloseClick}>
                                <FontAwesomeIcon icon={faTimes} />
                            </a>
                        </span>
                    </div>
                )}
                {this.props.children}
            </div>
        );

        return content;
    }
}

MovablePanel.displayName = 'MovablePanel';
MovablePanel.propTypes = {
    children: PropTypes.node,
    connectDragPreview: PropTypes.func,
    connectDragSource: PropTypes.func,
    dragOffset: PropTypes.object,
    isDragging: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onCloseClick: PropTypes.func,
    side: PropTypes.oneOf(['top', 'bottom']),
    title: PropTypes.string
};

export default DragSource(ItemTypes.PANEL, panelSource, collect)(MovablePanel);
