import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { buildArchon } from '../../archonMaker';

import './Archon.scss';

/**
 * @typedef ArchonProps
 * @property {import('./DeckList').Deck} deck
 */

/**
 * @param {ArchonProps} props
 */
const Archon = ({ deck }) => {
    const { i18n, t } = useTranslation();
    const [imageUrl, setImageUrl] = useState('');
    const [imageZoom, setImageZoom] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        buildArchon(deck).then((url) => {
            setImageUrl(url);
        });
    }, [deck, i18n.language, t, imageUrl]);

    return (
        <div>
            <img
                className='img-fluid'
                src={imageUrl}
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
                    <img className='img-fluid' src={imageUrl} />
                </div>
            )}
        </div>
    );
};

export default Archon;
