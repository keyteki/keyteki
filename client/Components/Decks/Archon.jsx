import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { buildArchon } from '../../archonMaker';

/**
 * @typedef ArchonProps
 * @property {import('./DeckList').Deck} deck
 * @property {function(boolean, string): void} onZoomToggle
 */

/**
 * @param {ArchonProps} props
 */
const Archon = ({ deck, onZoomToggle }) => {
    const { i18n } = useTranslation();
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        buildArchon(deck, i18n.language).then((url) => {
            setImageUrl(url);
        });
    }, [deck, i18n.language, imageUrl]);

    return (
        <img
            className={'img-fluid'}
            src={imageUrl}
            onMouseOut={() => onZoomToggle(false, null)}
            onMouseOver={() => onZoomToggle(true, imageUrl)}
        />
    );
};

export default Archon;
