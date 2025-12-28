import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import './Archon.scss';
import IdentityCardImage from './IdentityCardImage';

/**
 * @typedef IdentityCardProps
 * @property {import('./DeckList').Deck} deck
 */

/**
 * @param {IdentityCardProps} props
 */
const IdentityCard = ({ deck }) => {
    const [imageZoom, setImageZoom] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const user = useSelector((state) => state.account.user);
    const showAccolades =
        user?.settings?.optionSettings?.showAccolades !== undefined
            ? user.settings.optionSettings.showAccolades
            : true;

    const accoladesTitle =
        showAccolades && deck.accolades && deck.accolades.length > 0
            ? deck.accolades.map((a) => a.name).join('\n')
            : undefined;

    return (
        <div
            title={accoladesTitle}
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
        >
            <IdentityCardImage deck={deck} size={'x-large'} showAccolades={showAccolades} />
            {imageZoom && (
                <div
                    className='archon-zoom'
                    style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                >
                    <IdentityCardImage
                        deck={deck}
                        size={'xx-large'}
                        showAccolades={showAccolades}
                    />
                </div>
            )}
        </div>
    );
};

export default IdentityCard;
