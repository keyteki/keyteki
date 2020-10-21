import React, { useCallback, useRef } from 'react';
import classNames from 'classnames';
import { buildDeckList } from '../../archonMaker';
import { useTranslation } from 'react-i18next';
import { fabric } from 'fabric';

import './IdentityCard.scss';

const IdentityCard = ({ className, deck, size, onMouseOut, onMouseOver }) => {
    const fabricRef = useRef();
    const { t, i18n } = useTranslation();

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
                    fabricRef.current = await buildDeckList(canvas, deck, i18n.language, t);
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deck.uuid, i18n.language, t]
    );

    let fullClass = classNames('panel', 'card-pile', className, {
        size: size !== 'normal'
    });

    let image = <canvas className='card-image h-100 w-100' ref={ref} />;

    return (
        <div
            className={fullClass}
            onMouseOver={() =>
                onMouseOver({
                    image,
                    size: 'x-large'
                })
            }
            onMouseOut={onMouseOut}
        >
            <div className='card-wrapper'>
                <div className='card-frame'>
                    <div className={`game-card vertical ${size}`}>{image}</div>
                </div>
            </div>
        </div>
    );
};

IdentityCard.displayName = 'IdentityCard';

export default IdentityCard;
