import React, { useCallback, useRef, useState } from 'react';
import classNames from 'classnames';
import { buildDeckList } from '../../archonMaker';
import { useTranslation } from 'react-i18next';
import { fabric } from 'fabric';

import './IdentityCard.scss';

const IdentityCard = ({ cards, className, deck, size }) => {
    const [imageZoom, setImageZoom] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const fabricRef = useRef();
    const { t, i18n } = useTranslation();

    const ref = useCallback(
        async (node) => {
            if (node) {
                const canvas = new fabric.StaticCanvas(node, {
                    enableRetinaScaling: true,
                    renderOnAddRemove: false,
                    skipOffscreen: true
                });
                fabricRef.current = await buildDeckList(canvas, deck, i18n.language, t, cards);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deck.uuid, i18n.language, t, cards]
    );

    let fullClass = classNames('panel', 'card-pile', className, {
        size: size !== 'normal'
    });

    return (
        <div
            className={fullClass}
            onMouseMove={(event) => {
                let y = event.clientY;
                let yPlusHeight = y + 420;

                if (yPlusHeight >= window.innerHeight) {
                    y -= yPlusHeight - window.innerHeight;
                }

                setMousePos({ x: event.clientX, y: y });
            }}
            onMouseOver={() => {
                setImageZoom(true);
            }}
            onMouseOut={() => setImageZoom(false)}
        >
            <div className='card-wrapper'>
                <div className='card-frame'>
                    <div className={`game-card vertical ${size}`}>
                        <canvas className='card-image img-fluid h-100' ref={ref} />
                    </div>
                </div>
            </div>
            {imageZoom && (
                <div
                    className='identity-zoom'
                    style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                >
                    <canvas className='img-fluid h-100' ref={ref} />
                </div>
            )}
        </div>
    );
};

IdentityCard.displayName = 'IdentityCard';

export default IdentityCard;
