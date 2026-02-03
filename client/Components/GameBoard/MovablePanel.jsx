import React, { useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { ItemTypes } from '../../constants';
import PopupDefaults from './PopupDefaults';

import './MovablePanel.scss';

const MovablePanel = ({ children, name, onCloseClick, side, title, size }) => {
    const key = `${name}-${side}`;
    const savedStyle = localStorage.getItem(key);
    const style = (savedStyle && JSON.parse(savedStyle)) || PopupDefaults[key];

    if (style.left >= window.innerWidth) {
        style.left = window.innerWidth - 50;
    }

    if (style.top >= window.innerHeight) {
        style.top = window.innerHeight - 50;
    }

    const [position, setPosition] = useState(Object.assign({}, style));
    const popupRef = useRef(null);

    const getStyle = (offset) => {
        const style = {
            left: Math.max(offset.x, 10),
            top: Math.max(offset.y, 50),
            position: 'fixed'
        };

        const popup = $(popupRef.current);

        style.top -= popup.height();
        if (style.top < 50) {
            style.top = 50;
        }

        if (style.left + popup.width() > window.innerWidth) {
            style.left = window.innerWidth - popup.width();
        }

        if (style.top + 50 > window.innerHeight) {
            style.top = window.innerHeight - 50;
        }

        return style;
    };

    const [{ isDragging, dragOffset }, drag] = useDrag({
        type: ItemTypes.PANEL,
        item: { name: key },
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging(),
                dragOffset: monitor.getSourceClientOffset()
            };
        },
        end: (_, monitor) => {
            const offset = monitor.getSourceClientOffset();
            if (!offset) {
                return;
            }
            const style = getStyle(offset);

            localStorage.setItem(`${key}`, JSON.stringify(style));
        }
    });

    useEffect(() => {
        if (isDragging && dragOffset) {
            let style = getStyle(dragOffset);

            setPosition(style);
        }
    }, [dragOffset, isDragging]);

    let content = (
        <div ref={popupRef}>
            <div className={`panel panel-primary ${size}`} style={position}>
                <div
                    ref={drag}
                    className='panel-heading'
                    onClick={(event) => event.stopPropagation()}
                >
                    <span className='text-center'>{title}</span>
                    <span className='float-right'>
                        <a className='close-button' onClick={onCloseClick}>
                            <FontAwesomeIcon icon={faTimes} />
                        </a>
                    </span>
                </div>
                {children}
            </div>
        </div>
    );

    return content;
};

MovablePanel.displayName = 'MovablePanel';

export default MovablePanel;
