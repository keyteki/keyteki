import React, { useEffect, useState } from 'react';
import mergeImages from 'merge-images';
import { useTranslation } from 'react-i18next';

import './CardImage.scss';

const EnhancementBaseImages = {};

import AmberImage from '../../assets/img/enhancements/amber.png';
import CaptureImage from '../../assets/img/enhancements/capture.png';
import DrawImage from '../../assets/img/enhancements/draw.png';
import DamageImage from '../../assets/img/enhancements/damage.png';

const EnhancementImages = {
    amber: AmberImage,
    capture: CaptureImage,
    draw: DrawImage,
    damage: DamageImage
};

for (let i = 1; i < 6; i++) {
    EnhancementBaseImages[i] = require(`../../assets/img/enhancements/base-${i}.png`);
}

/**
 * @typedef CardImageProps
 * @property {object} card // The card data to render an image for
 * @property {string} [cardBack] // The card back image to show if not showing the card image
 */

/**
 *
 * @param {CardImageProps} props
 */
const CardImage = ({ card, cardBack }) => {
    const { i18n } = useTranslation();
    let [cardImage, setCardImage] = useState(<div />);
    let { maverick, anomaly, amber, enhancements, image } = card;

    if (card.cardPrintedAmber) {
        amber = card.cardPrintedAmber;
    }

    useEffect(() => {
        if (card.facedown) {
            setCardImage(cardBack);
            return;
        }
        let imgPath = `/img/cards/${i18n.language === 'en' ? '' : i18n.language + '/'}${image}.png`;

        let imagesToMerge = [];
        if (maverick) {
            let bonusIcons = amber > 0 || (enhancements && enhancements.length > 0);
            let maverickHouseImg =
                '/img/maverick/maverick-' + maverick + (bonusIcons ? '-amber' : '') + '.png';
            imagesToMerge.push({ src: maverickHouseImg, x: 0, y: 0 });
            imagesToMerge.push({ src: '/img/maverick/maverick-corner.png', x: 210, y: 0 });
        }

        if (anomaly) {
            let maverickHouseImg =
                '/img/maverick/maverick-' + anomaly + (amber > 0 ? '-amber' : '') + '.png';
            imagesToMerge.push({ src: maverickHouseImg, x: 0, y: 0 });
        }

        if (enhancements && enhancements.length > 0 && enhancements[0] !== '') {
            let y = 59 + (amber ? amber * 30 : 0);
            imagesToMerge.push({
                src: EnhancementBaseImages[enhancements.length],
                x: 14,
                y
            });
            enhancements.forEach((enhancement, index) => {
                imagesToMerge.push({
                    src: EnhancementImages[enhancement],
                    x: 21,
                    y: y + 10 + index * 31
                });
            });
        }

        if (imagesToMerge.length > 0) {
            mergeImages([imgPath, ...imagesToMerge])
                .then((src) => setCardImage(<img className='img-fluid' src={src} />))
                .catch(() => {});
        } else {
            setCardImage(<img className='img-fluid' src={imgPath} />);
        }
    }, [
        amber,
        anomaly,
        i18n.language,
        maverick,
        enhancements,
        setCardImage,
        image,
        cardBack,
        card.facedown,
        card
    ]);

    return cardImage;
};

export default CardImage;
