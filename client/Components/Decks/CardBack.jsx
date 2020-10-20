import React, { useRef, useCallback, useState } from 'react';
import { fabric } from 'fabric';
import { buildCardBack } from '../../archonMaker';

import './Archon.scss';

const CardBack = ({ deck, showDeckName = true, zoom = true }) => {
    const fabricRef = useRef();
    const [imageZoom, setImageZoom] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const ref = useCallback(
        async (node) => {
            if (node) {
                let canvas;
                try {
                    canvas = new fabric.StaticCanvas(node);
                } catch {
                    fabricRef.current = null;
                }

                if (canvas) {
                    fabricRef.current = await buildCardBack(canvas, deck, showDeckName);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deck.name, deck.uuid, showDeckName]
    );

    return (
        <div>
            <canvas
                className='img-fluid h-100'
                ref={ref}
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
            />
            {imageZoom && zoom && (
                <div
                    className='archon-zoom'
                    style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                >
                    <canvas className='img-fluid h-100' ref={ref} />
                </div>
            )}
        </div>
    );
};

export default CardBack;
