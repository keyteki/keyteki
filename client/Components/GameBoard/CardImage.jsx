import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fabric } from 'fabric';
import { buildCard } from '../../archonMaker';

import './CardImage.scss';

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
    let [cardImage, setCardImage] = useState(null);
    const { i18n } = useTranslation();
    const fabricRef = useRef();

    const ref = useCallback(
        async (node) => {
            if (node) {
                let canvas;
                try {
                    canvas = new fabric.StaticCanvas(node, {
                        enableRetinaScaling: true,
                        objectCaching: false,
                        noScaleCache: false
                    });
                } catch {
                    fabricRef.current = null;
                }

                if (canvas) {
                    fabricRef.current = await buildCard(canvas, {
                        ...card,
                        url: `/img/cards/${i18n.language === 'en' ? '' : i18n.language + '/'}${
                            card.image
                        }.png`
                    });
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [card.id, i18n.language]
    );

    useEffect(() => {
        if (card.facedown) {
            setCardImage(cardBack);
        } else {
            setCardImage(<canvas className='img-fluid h-100 w-100' ref={ref} />);
        }
    }, [card.facedown, card.id, ref, cardBack]);
    if (cardImage) {
        return cardImage;
    }
    return <div />;
};

export default CardImage;
