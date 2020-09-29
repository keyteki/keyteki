import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
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
const IdentityCard = ({ deck }) => {
    const fabricRef = useRef();
    const { t, i18n } = useTranslation();
    const [imageZoom, setImageZoom] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const cards = useSelector((state) => state.cards.cards);

    const ref = useCallback(
        async (node) => {
            if (node) {
                const canvas = new fabric.StaticCanvas(node);
                fabricRef.current = await buildDeckList(canvas, deck, i18n.language, t, cards);
            }
        },
        [deck, i18n.language, t, cards]
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
            {imageZoom && (
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

export default IdentityCard;
