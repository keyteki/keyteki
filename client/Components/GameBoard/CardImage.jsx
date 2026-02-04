import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as fabricModule from 'fabric';

const fabric = fabricModule.fabric ?? fabricModule;
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
    const { i18n } = useTranslation();
    const user = useSelector((state) => state.account.user);
    const showAccolades =
        user?.settings?.optionSettings?.showAccolades !== undefined
            ? user.settings.optionSettings.showAccolades
            : true;
    const fabricRef = useRef(null);
    const renderIdRef = useRef(0);
    const warnRef = useRef(false);

    const setCanvasRef = useCallback((node) => {
        if (!node) {
            if (fabricRef.current) {
                fabricRef.current.dispose();
                fabricRef.current = null;
            }
            return;
        }

        if (!fabricRef.current) {
            try {
                fabricRef.current = new fabric.StaticCanvas(node);
                fabricRef.current.renderOnAddRemove = false;
            } catch {
                fabricRef.current = null;
            }
        }
    }, []);

    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas || !card || card.facedown) {
            if (!canvas && card && !warnRef.current) {
                warnRef.current = true;
            }
            return;
        }

        const renderId = ++renderIdRef.current;
        canvas.clear();

        const url = `/img/cards/${halfSize ? 'halfSize/' : ''}${
            i18n.language === 'en' ? '' : i18n.language
        }/${card.image.replace(/\*/g, '_')}.${halfSize ? 'jpg' : 'png'}`;

        (async () => {
            try {
                await buildCard(canvas, {
                    ...card,
                    size,
                    halfSize,
                    showAccolades,
                    url
                });
            } catch {
                // ignore
            }

            if (renderId !== renderIdRef.current) {
                return;
            }
        })();
    }, [
        card?.id,
        card?.location,
        card?.modifiedPower,
        card?.tokens && card.tokens.amber,
        card?.tokens && card.tokens.armor,
        card?.tokens && card.tokens.awakening,
        card?.tokens && card.tokens.damage,
        card?.tokens && card.tokens.depth,
        card?.tokens && card.tokens.disruption,
        card?.tokens && card.tokens.doom,
        card?.tokens && card.tokens.enrage,
        card?.tokens && card.tokens.fuse,
        card?.tokens && card.tokens.glory,
        card?.tokens && card.tokens.growth,
        card?.tokens && card.tokens.ignorance,
        card?.tokens && card.tokens.knowledge,
        card?.tokens && card.tokens.mutation,
        card?.tokens && card.tokens.power,
        card?.tokens && card.tokens.scheme,
        card?.tokens && card.tokens.time,
        card?.tokens && card.tokens.ward,
        card?.tokens && card.tokens.warrant,
        card?.tokens && card.tokens.yea,
        card?.tokens && card.tokens.nay,
        card?.tokens && card.tokens.wisdom,
        card?.tokens && card.tokens.hatch,
        card?.tokens && card.tokens.paint,
        card?.tokens && card.tokens.trade,
        card?.tokens && card.tokens.stun,
        card?.pseudoDamage,
        card?.wardBroken,
        card?.facedown,
        size,
        halfSize,
        showAccolades,
        i18n.language
    ]);

    if (card?.facedown) {
        return cardBack || <div />;
    }

    return (
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
            ref={setCanvasRef}
        />
    );
};

export default CardImage;
