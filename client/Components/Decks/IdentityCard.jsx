import React, { useCallback, useEffect, useRef, useState } from 'react';
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

    useEffect(() => {
        if (cards && Object.keys(cards).length > 0) {
            const canvas = new fabric.StaticCanvas();
            buildDeckList(canvas, deck, i18n.language, t, cards).then((list) => {
                fabricRef.current = list;
            });
        }
    }, [deck, i18n.language, t, cards]);

    const useFabric = (deck, i18n, t, cards) => {
        return useCallback(
            async (node) => {
                if (node) {
                    const canvas = new fabric.StaticCanvas(node);
                    buildDeckList(canvas, deck, i18n.language, t, cards).then((list) => {
                        fabricRef.current = list;
                    });
                }
            },
            [deck, i18n.language, t, cards]
        );
    };
    const ref = useFabric(deck, i18n, t, cards);

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
