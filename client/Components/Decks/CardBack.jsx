import React, { useRef, useCallback, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { buildCardBack } from '../../archonMaker';

import './Archon.scss';

const CardBack = ({ deck, showDeckName = true, zoom = true }) => {
    const fabricRef = useRef();
    const [imageZoom, setImageZoom] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = new fabric.StaticCanvas();
        buildCardBack(canvas, deck, showDeckName).then((cardBack) => {
            fabricRef.current = cardBack;
        });
    }, [deck, showDeckName]);

    const useFabric = (deck, showDeckName) => {
        return useCallback(
            async (node) => {
                if (node) {
                    const canvas = new fabric.StaticCanvas(node);
                    buildCardBack(canvas, deck, showDeckName).then((cardBack) => {
                        fabricRef.current = cardBack;
                    });
                }
            },
            [deck, showDeckName]
        );
    };

    const ref = useFabric(deck, showDeckName, zoom);

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
