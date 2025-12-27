import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { fabric } from 'fabric';

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
                    fabricRef.current = await buildDeckList(
                        canvas,
                        deck,
                        i18n.language,
                        t,
                        size,
                        showAccolades
                    );
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deck.uuid, i18n.language, t, showAccolades]
    );

    return <canvas className='w-100 h-100' ref={ref} />;
};

export default IdentityCardImage;
