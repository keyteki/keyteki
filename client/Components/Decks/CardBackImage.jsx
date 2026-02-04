import React, { useCallback, useEffect, useRef } from 'react';
import * as fabricModule from 'fabric';

const fabric = fabricModule.fabric ?? fabricModule.default ?? fabricModule;
import { buildCardBack } from '../../archonMaker';

import './Archon.scss';

const CardBackImage = ({ deck, showDeckName = true, size }) => {
    const fabricRef = useRef();
    const setCanvasRef = useCallback((node) => {
        if (!node) {
            if (fabricRef.current) {
                fabricRef.current.dispose();
                fabricRef.current = null;
            }
            return;
        }

        if (!fabricRef.current) {
            try {
                fabricRef.current = new fabric.StaticCanvas(node);
                fabricRef.current.renderOnAddRemove = false;
            } catch {
                fabricRef.current = null;
            }
        }
    }, []);

    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas || !deck) {
            return;
        }

        canvas.clear();
        (async () => {
            try {
                await buildCardBack(canvas, deck, size, showDeckName);
            } catch {
                // ignore
            }
        })();
    }, [deck?.name, deck?.uuid, showDeckName, size, deck]);

    return <canvas className='w-100 h-100' ref={setCanvasRef} />;
};

export default CardBackImage;
