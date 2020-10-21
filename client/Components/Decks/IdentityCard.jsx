import React, { useState } from 'react';

import './Archon.scss';
import IdentityCardImage from './IdentityCardImage';

/**
 * @typedef IdentityCardProps
 * @property {import('./DeckList').Deck} deck
 */

/**
 * @param {IdentityCardProps} props
 */
const IdentityCard = ({ deck }) => {
    const [imageZoom, setImageZoom] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    return (
        <div
            onMouseMove={(event) => {
                let y = event.clientY;
                let yPlusHeight = y + 364;

                if (yPlusHeight >= window.innerHeight) {
                    y -= yPlusHeight - window.innerHeight;
                }

                setMousePos({ x: event.clientX, y: y });
            }}
            onMouseOver={() => {
                setImageZoom(true);
            }}
            onMouseOut={() => setImageZoom(false)}
        >
            <IdentityCardImage deck={deck} size={'x-large'} />
            {imageZoom && (
                <div
                    className='archon-zoom'
                    style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                >
                    <IdentityCardImage deck={deck} />
                </div>
            )}
        </div>
    );
};

export default IdentityCard;
