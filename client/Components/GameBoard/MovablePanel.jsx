import React, { useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import Icon from '../Icon';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { ItemTypes } from '../../constants';
import PopupDefaults from './PopupDefaults';

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
        const popupHeight = popupRef.current?.offsetHeight ?? 0;
        const popupWidth = popupRef.current?.offsetWidth ?? 0;
        const minLeft = 10;
        const minTop = 50;
        const maxLeft = Math.max(window.innerWidth - popupWidth, minLeft);
        const maxTop = Math.max(window.innerHeight - popupHeight, minTop);

        return {
            left: Math.min(Math.max(offset.x, minLeft), maxLeft),
            top: Math.min(Math.max(offset.y, minTop), maxTop),
            position: 'fixed'
        };
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
        <div
            ref={popupRef}
            className={`panel relative flex flex-col overflow-hidden rounded-md border border-border/70 bg-[color:color-mix(in_oklab,var(--surface)_92%,transparent)] text-foreground ${size}`}
            style={position}
        >
            <div
                ref={drag}
                className='flex min-h-6 shrink-0 items-center justify-center gap-1 border-b border-border/70 bg-[color:color-mix(in_oklab,var(--brand)_10%,var(--surface))] px-2 py-1 text-[color:var(--brand)]'
                onClick={(event) => event.stopPropagation()}
            >
                <span className='flex-1 text-center text-base leading-none font-normal'>
                    {title}
                </span>
                <button
                    type='button'
                    className='m-0 cursor-pointer border-0 bg-transparent p-0 leading-none text-inherit'
                    onClick={onCloseClick}
                >
                    <Icon icon={faTimes} />
                </button>
            </div>
            <div className='min-h-0 flex-1'>{children}</div>
        </div>
    );

    return content;
};

MovablePanel.displayName = 'MovablePanel';

export default MovablePanel;
