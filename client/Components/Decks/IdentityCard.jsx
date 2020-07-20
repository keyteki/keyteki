import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { buildDeckList } from '../../archonMaker';
import IdentityDefault from '../../assets/img/idbacks/identity.jpg';

import './Archon.scss';

/**
 * @typedef IdentityCardProps
 * @property {import('./DeckList').Deck} deck
 */

/**
 * @param {IdentityCardProps} props
 */
const IdentityCard = ({ deck }) => {
    const { t, i18n } = useTranslation();
    const [imageUrl, setImageUrl] = useState('');
    const [imageZoom, setImageZoom] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const cards = useSelector((state) => state.cards.cards);

    useEffect(() => {
        if (!cards || cards.length === 0) {
            return;
        }

        buildDeckList(deck, i18n.language, t, cards)
            .then((deckListUrl) => {
                setImageUrl(deckListUrl);
            })
            .catch(() => {
                setImageUrl(IdentityDefault);
            });
    }, [deck, i18n.language, imageUrl, t, cards]);

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

export default IdentityCard;
