import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, toast } from '@heroui/react';
import {
    faChevronLeft,
    faChevronRight,
    faCircleNotch,
    faShareNodes
} from '@fortawesome/free-solid-svg-icons';

import Icon from '../Icon';
import Logo from '../../assets/img/main_header_logo.png';
import useWrappedCards from './useWrappedCards';
import { renderCard, shareImage } from './shareCard';

/**
 * @typedef WrappedStoryProps
 * @property {object} wrapped The snapshot from WrappedService
 * @property {string} username
 */

/**
 * The Wrapped cards one at a time, in a phone-story-shaped frame that is also what gets shared as an image
 * @param {WrappedStoryProps} props
 */
const WrappedStory = ({ wrapped, username }) => {
    const { t } = useTranslation();
    const cards = useWrappedCards(wrapped, username);
    const [index, setIndex] = useState(0);
    const [isSharing, setIsSharing] = useState(false);
    const frameRef = useRef(null);

    const card = cards[Math.min(index, cards.length - 1)];
    const go = useCallback(
        (step) => setIndex((current) => Math.min(Math.max(current + step, 0), cards.length - 1)),
        [cards.length]
    );

    useEffect(() => {
        const onKeyDown = (event) => {
            const target = event.target;
            if (target.closest?.('input, textarea, select, [contenteditable="true"]')) {
                return;
            }

            // Space only moves on when nothing is focused, so it still presses whichever button is
            const isSpace = event.key === ' ' && (target === document.body || target === document);

            if (event.key === 'ArrowRight' || isSpace) {
                event.preventDefault();
                go(1);
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                go(-1);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [go]);

    const share = async () => {
        setIsSharing(true);

        try {
            const blob = await renderCard(frameRef.current);
            const result = await shareImage(
                blob,
                `crucible-wrapped-${wrapped.year}-${card.key}.png`,
                t('My {{year}} on The Crucible Online', { year: wrapped.year })
            );

            if (result === 'downloaded') {
                toast.success(t('Image saved'));
            }
        } catch (error) {
            toast.danger(t('The image could not be made. Please try again.'));
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className='flex w-full flex-col items-center gap-3 py-2'>
            <div
                ref={frameRef}
                className={`@container relative aspect-[9/16] select-none overflow-hidden rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] ${card.background}`}
                style={{ width: 'min(100%, calc((100dvh - 10rem) * 9 / 16))' }}
            >
                <div className='absolute inset-x-[5cqw] top-[4cqw] z-10 flex gap-[1.2cqw]'>
                    {cards.map((item, itemIndex) => (
                        <div
                            key={item.key}
                            className={`h-[0.9cqw] flex-1 rounded-full ${
                                itemIndex <= index ? 'bg-white/90' : 'bg-white/30'
                            }`}
                        />
                    ))}
                </div>

                <div
                    key={card.key}
                    className='absolute inset-0 motion-safe:animate-[wrapped-in_350ms_ease-out]'
                >
                    <div className='relative h-full px-[8cqw] pb-[14cqw] pt-[12cqw]'>
                        {card.content}
                    </div>
                </div>

                <div className='absolute inset-x-[8cqw] bottom-[5cqw] z-10 flex items-end justify-between gap-[3cqw] text-[3.4cqw] text-white/70'>
                    <img
                        alt={t('The Crucible Online')}
                        className='h-[3.4cqw] w-auto opacity-85'
                        src={Logo}
                    />
                    {card.note && <span className='shrink-0 text-right'>{card.note}</span>}
                </div>

                <button
                    aria-label={t('Previous')}
                    className='absolute inset-y-0 left-0 z-20 w-[30%] cursor-w-resize'
                    data-share-exclude
                    type='button'
                    onClick={() => go(-1)}
                />
                <button
                    aria-label={t('Next')}
                    className='absolute inset-y-0 right-0 z-20 w-[70%] cursor-e-resize'
                    data-share-exclude
                    type='button'
                    onClick={() => go(1)}
                />
            </div>

            <div className='flex items-center gap-2'>
                <Button
                    aria-label={t('Previous')}
                    isDisabled={index === 0}
                    isIconOnly
                    size='sm'
                    variant='ghost'
                    onPress={() => go(-1)}
                >
                    <Icon icon={faChevronLeft} />
                </Button>
                <Button isDisabled={isSharing} size='sm' variant='primary' onPress={share}>
                    <Icon icon={isSharing ? faCircleNotch : faShareNodes} spin={isSharing} />
                    {t('Share this card')}
                </Button>
                <Button
                    aria-label={t('Next')}
                    isDisabled={index === cards.length - 1}
                    isIconOnly
                    size='sm'
                    variant='ghost'
                    onPress={() => go(1)}
                >
                    <Icon icon={faChevronRight} />
                </Button>
            </div>
        </div>
    );
};

export default WrappedStory;
