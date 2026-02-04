import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as fabric from 'fabric';

import './Archon.scss';
import { buildDeckList } from '../../archonMaker';

/**
 * @typedef IdentityCardProps
 * @property {import('./DeckList').Deck} deck
 */

/**
 * @param {IdentityCardProps} props
 */
const IdentityCardImage = ({ deck, size, showAccolades = true }) => {
    const fabricRef = useRef();
    const { t, i18n } = useTranslation();

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
                await buildDeckList(canvas, deck, i18n.language, t, size, showAccolades);
            } catch {
                // ignore
            }
        })();
    }, [deck?.uuid, i18n.language, t, size, showAccolades, deck]);

    return <canvas className='w-100 h-100' ref={setCanvasRef} />;
};

export default IdentityCardImage;
