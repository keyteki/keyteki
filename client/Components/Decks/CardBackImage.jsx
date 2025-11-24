import React, { useRef, useCallback } from 'react';
import { fabric } from 'fabric';
import { buildCardBack } from '../../archonMaker';

import './Archon.scss';

const CardBackImage = ({ deck, showDeckName = true, size }) => {
    const fabricRef = useRef();
    const ref = useCallback(
        async (node) => {
            if (node && deck) {
                let canvas;
                try {
                    canvas = new fabric.StaticCanvas(node);
                } catch {
                    fabricRef.current = null;
                }

                if (canvas) {
                    fabricRef.current = await buildCardBack(canvas, deck, size, showDeckName);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deck.name, deck.uuid, showDeckName]
    );

    return <canvas className='w-full! h-full!' ref={ref} />;
};

export default CardBackImage;
