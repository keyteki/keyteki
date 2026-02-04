import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as fabricModule from 'fabric';

const fabric = fabricModule.fabric ?? fabricModule;

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
    const warnRef = useRef(false);
    const { t, i18n } = useTranslation();

    const logProdError = (...args) => {
        if (import.meta.env.PROD) {
            console.error(...args);
        }
    };

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
            } catch (err) {
                logProdError('IdentityCardImage failed to init fabric canvas', err);
                fabricRef.current = null;
            }
        }
    }, []);

    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas || !deck) {
            if (!canvas && deck && !warnRef.current) {
                warnRef.current = true;
            }
            return;
        }

        canvas.clear();
        (async () => {
            try {
                await buildDeckList(canvas, deck, i18n.language, t, size, showAccolades);
            } catch (err) {
                logProdError('IdentityCardImage buildDeckList failed', err);
            }
        })();
    }, [deck?.uuid, i18n.language, t, size, showAccolades, deck]);

    return <canvas className='w-100 h-100' ref={setCanvasRef} />;
};

export default IdentityCardImage;
