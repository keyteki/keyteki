import React, { useEffect, useState } from 'react';
import mergeImages from 'merge-images';
import { useTranslation } from 'react-i18next';

import './CardImage.scss';

const CardImage = ({ card }) => {
    const { i18n } = useTranslation();
    let [mergedImage, setMergedImage] = useState('');

    let { maverick, anomaly, amber, enhancements, card: cardData } = card;

    useEffect(() => {
        let imgPath = `/img/cards/${i18n.language === 'en' ? '' : i18n.language}/${
            cardData.image
        }.png`;
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

        if (enhancements && enhancements.length > 0) {
            let y = 59 + amber * 30;
            imagesToMerge.push({
                src: `/img/enhancements/base-${enhancements.length}.png`,
                x: 14,
                y
            });
            enhancements.forEach((enhancement, index) => {
                imagesToMerge.push({
                    src: `/img/enhancements/${enhancement}.png`,
                    x: 21,
                    y: y + 10 + index * 31
                });
            });
        }

        if (imagesToMerge.length > 0) {
            mergeImages([imgPath, ...imagesToMerge])
                .then((src) => setMergedImage(src))
                .catch(() => {});
        } else {
            setMergedImage(imgPath);
        }
    }, [amber, anomaly, i18n.language, maverick, enhancements, setMergedImage, cardData.image]);

    if (!cardData.image) {
        return null;
    }

    return (
        <>
            <img src={mergedImage} />
        </>
    );
};

export default CardImage;
