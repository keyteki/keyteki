import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { buildArchon } from '../../archonMaker';

/**
 * @typedef ArchonProps
 * @property {Deck} deck
 * @property {function(boolean): void} onZoomToggle
 * @property {function(string): void} onImageChanged
 */

/**
 * @param {ArchonProps} props
 */
const Archon = ({ deck, onZoomToggle, onImageChanged }) => {
    const { i18n } = useTranslation();
    const [imageUrl, setImageUrl] = useState('');

    const loadArchon = () => {
        buildArchon(deck, i18n.language).then((imageUrl) => {
            setImageUrl(imageUrl);
            onImageChanged(imageUrl);
        });
    };

    useEffect(loadArchon, []);

    return (
        <img
            className={'img-fluid'}
            src={imageUrl}
            onMouseOut={() => onZoomToggle(false)}
            onMouseOver={() => onZoomToggle(true)}
        />
    );
};

export default Archon;
