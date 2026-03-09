import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as fabricModule from 'fabric';

const fabric = fabricModule.fabric ?? fabricModule.default ?? fabricModule;
import { buildCard } from '../../archonMaker';

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
    const enhancementSignature = Array.isArray(card?.enhancements)
        ? card.enhancements.join('|')
        : '';
    const [imageSrc, setImageSrc] = useState('');
    const renderScale =
        typeof window !== 'undefined' && (window.devicePixelRatio || 1) < 1.5 ? 2 : 1;
    const cardId = card?.id;
    const cardLocation = card?.location;
    const modifiedPower = card?.modifiedPower;
    const pseudoDamage = card?.pseudoDamage;
    const wardBroken = card?.wardBroken;
    const facedown = card?.facedown;
    const tokens = card?.tokens || {};
    const amberTokens = tokens.amber;
    const armorTokens = tokens.armor;
    const awakeningTokens = tokens.awakening;
    const damageTokens = tokens.damage;
    const depthTokens = tokens.depth;
    const disruptionTokens = tokens.disruption;
    const doomTokens = tokens.doom;
    const enrageTokens = tokens.enrage;
    const fuseTokens = tokens.fuse;
    const gloryTokens = tokens.glory;
    const growthTokens = tokens.growth;
    const ignoranceTokens = tokens.ignorance;
    const knowledgeTokens = tokens.knowledge;
    const mutationTokens = tokens.mutation;
    const powerTokens = tokens.power;
    const schemeTokens = tokens.scheme;
    const timeTokens = tokens.time;
    const wardTokens = tokens.ward;
    const warrantTokens = tokens.warrant;
    const yeaTokens = tokens.yea;
    const nayTokens = tokens.nay;
    const wisdomTokens = tokens.wisdom;
    const hatchTokens = tokens.hatch;
    const paintTokens = tokens.paint;
    const tradeTokens = tokens.trade;
    const stunTokens = tokens.stun;
    const imageExtension = halfSize ? 'jpg' : 'png';
    const languageSegment = i18n.language === 'en' ? '' : `${i18n.language}/`;
    const imageName = card?.image ? card.image.replace(/\*/g, '_') : '';
    const localizedImageUrl = `/img/cards/${
        halfSize ? 'halfSize/' : ''
    }${languageSegment}${imageName}.${imageExtension}`;
    const englishImageUrl = `/img/cards/${
        halfSize ? 'halfSize/' : ''
    }${imageName}.${imageExtension}`;
    const shouldRenderCanvas =
        Boolean(card?.maverick) ||
        Boolean(card?.anomaly) ||
        (Array.isArray(card?.enhancements) && card.enhancements.length > 0) ||
        card?.location === 'play area' ||
        card?.location === 'zoom';

    useEffect(() => {
        setImageSrc(localizedImageUrl);
    }, [localizedImageUrl]);
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
            return;
        }

        const renderId = ++renderIdRef.current;
        canvas.clear();

        (async () => {
            try {
                await buildCard(canvas, {
                    ...card,
                    size,
                    halfSize,
                    showAccolades,
                    renderScale,
                    url: localizedImageUrl
                });
            } catch {
                // ignore
            }

            if (renderId !== renderIdRef.current) {
                return;
            }
        })();
    }, [
        card,
        cardId,
        enhancementSignature,
        cardLocation,
        modifiedPower,
        amberTokens,
        armorTokens,
        awakeningTokens,
        damageTokens,
        depthTokens,
        disruptionTokens,
        doomTokens,
        enrageTokens,
        fuseTokens,
        gloryTokens,
        growthTokens,
        ignoranceTokens,
        knowledgeTokens,
        mutationTokens,
        powerTokens,
        schemeTokens,
        timeTokens,
        wardTokens,
        warrantTokens,
        yeaTokens,
        nayTokens,
        wisdomTokens,
        hatchTokens,
        paintTokens,
        tradeTokens,
        stunTokens,
        pseudoDamage,
        wardBroken,
        facedown,
        size,
        halfSize,
        showAccolades,
        renderScale,
        localizedImageUrl,
        i18n.language
    ]);

    if (card?.facedown) {
        return cardBack || <div />;
    }

    if (!shouldRenderCanvas) {
        return (
            <img
                src={imageSrc}
                onError={() => {
                    if (imageSrc !== englishImageUrl) {
                        setImageSrc(englishImageUrl);
                    }
                }}
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
                        : undefined
                }
                onMouseOut={onMouseOut}
                className='block h-full w-full'
            />
        );
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
            className='block h-full w-full'
            ref={setCanvasRef}
        />
    );
};

export default CardImage;
