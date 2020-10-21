import React, { useState } from 'react';
import CardBackImage from './CardBackImage'

import './Archon.scss';

const CardBack = ({ deck, showDeckName = true, zoom = true, size }) => {
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
            onMouseOut={() => setImageZoom(false)}>
            <CardBackImage deck={deck} showDeckName={showDeckName} size={size}/>
            {imageZoom && zoom && (
                <div
                    className='archon-zoom'
                    style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                >
                    <CardBackImage deck={deck} showDeckName={showDeckName} />
                </div>
            )}
        </div>
    );
};

export default CardBack;
