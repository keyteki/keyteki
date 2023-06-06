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
const CardImage = ({ card, cardBack, size, halfSize, onMouseOver, onMouseOut }) => {
    let [cardImage, setCardImage] = useState(null);
    const { i18n } = useTranslation();
    const fabricRef = useRef();

    const ref = useCallback(
        async (node) => {
            if (node && card) {
                let canvas;
                try {
                    canvas = new fabric.StaticCanvas(node);
                } catch {
                    fabricRef.current = null;
                }

                if (canvas) {
                    fabricRef.current = await buildCard(canvas, {
                        ...card,
                        size,
                        halfSize,
                        url: `/img/${halfSize ? 'halfSize' : 'cards'}/${
                            i18n.language === 'en' ? '' : i18n.language
                        }/${card.image}.${halfSize ? 'jpg' : 'png'}`
                    });
                }
            }
        },
        /* eslint-disable react-hooks/exhaustive-deps */
        [
            card.id,
            card.location,
            card.modifiedPower,
            card.tokens && card.tokens.amber,
            card.tokens && card.tokens.armor,
            card.tokens && card.tokens.awakening,
            card.tokens && card.tokens.damage,
            card.tokens && card.tokens.depth,
            card.tokens && card.tokens.disruption,
            card.tokens && card.tokens.doom,
            card.tokens && card.tokens.enrage,
            card.tokens && card.tokens.fuse,
            card.tokens && card.tokens.glory,
            card.tokens && card.tokens.growth,
            card.tokens && card.tokens.ignorance,
            card.tokens && card.tokens.knowledge,
            card.tokens && card.tokens.power,
            card.tokens && card.tokens.scheme,
            card.tokens && card.tokens.time,
            card.tokens && card.tokens.ward,
            card.tokens && card.tokens.warrant,
            card.tokens && card.tokens.yea,
            card.tokens && card.tokens.nay,
            card.tokens && card.tokens.wisdom,
            card.tokens && card.tokens.hatch,
            card.tokens && card.tokens.paint,
            card.tokens && card.tokens.trade,
            card.stunned,
            card.pseudoDamage,
            card.wardBroken,
            i18n.language
        ]
        /* eslint-enable react-hooks/exhaustive-deps */
    );

    useEffect(() => {
        if (card.facedown) {
            setCardImage(cardBack);
        } else {
            setCardImage(
                <canvas
                    onMouseOver={
                        onMouseOver
                            ? () =>
                                  onMouseOver({
                                      image: (
                                          <CardImage
                                              card={{ ...card, location: 'zoom' }}
                                              cardBack={cardBack}
                                          />
                                      ),
                                      size: 'normal'
                                  })
                            : null
                    }
                    onMouseOut={onMouseOut}
                    className='h-100 w-100'
                    ref={ref}
                />
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [card.facedown, card.id, ref, cardBack]);

    if (cardImage) {
        return cardImage;
    }
    return <div />;
};

export default CardImage;
