import React from 'react';
import { createPortal } from 'react-dom';
import CardImage from '../GameBoard/CardImage';

const CardHoverPreview = ({ card, position }) => {
    if (!card) {
        return null;
    }

    const previewWidth = 300;
    const previewHeight = 420;
    const cursorGap = 14;
    const viewportPadding = 8;

    let left = position.x + cursorGap;
    let top = position.y - previewHeight / 2;

    if (typeof window !== 'undefined') {
        if (left + previewWidth > window.innerWidth - viewportPadding) {
            left = position.x - previewWidth - cursorGap;
        }

        const minTop = viewportPadding;
        const maxTop = window.innerHeight - previewHeight - viewportPadding;
        top = Math.min(Math.max(top, minTop), maxTop);
    }

    return createPortal(
        <div
            className='pointer-events-none fixed z-[1200]'
            style={{ left: `${left}px`, top: `${top}px` }}
        >
            <div className='w-72'>
                <CardImage card={Object.assign({}, card)} />
            </div>
        </div>,
        document.body
    );
};

export default CardHoverPreview;
