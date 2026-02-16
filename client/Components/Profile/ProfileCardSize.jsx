import React from 'react';
import { useTranslation } from 'react-i18next';

import IdentityDefault from '../../assets/img/idbacks/identity.jpg';

/**
 * @typedef ProfileCardSizeOption
 * @property {string} name The name of the option used in the database
 * @property {string} label The card size option label displayed to the user
 */

/**
 * @typedef CardSizeProps
 * @property {ProfileCardSizeOption[]} cardSizes The list of available card sizes
 * @property {string} selectedCardSize The currently selected card size
 * @property {function(string): void} onCardSizeSelected Called when the selected card size is changed
 */

const sizeClassMap = {
    small: 'w-16',
    normal: 'w-20',
    large: 'w-24',
    'x-large': 'w-28'
};

const glyphClassMap = {
    small: 'h-6 w-4',
    normal: 'h-7 w-5',
    large: 'h-8 w-6',
    'x-large': 'h-9 w-7'
};

/**
 * @param {CardSizeProps} props
 */
const ProfileCardSize = ({ cardSizes, selectedCardSize, onCardSizeSelected }) => {
    const { t } = useTranslation();

    return (
        <div className='w-full border-t border-border/70'>
            <div className='w-full max-w-3xl pt-2'>
                <div className='mb-2 text-xs font-medium tracking-wide text-muted'>
                    {t('Card Image Size')}
                </div>
                <div className='grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_150px]'>
                    <div
                        className='grid grid-cols-2 gap-2 md:grid-cols-4'
                        role='radiogroup'
                        aria-label={t('Card Image Size')}
                    >
                        {cardSizes.map((cardSize) => {
                            const isSelected = selectedCardSize === cardSize.name;

                            return (
                                <button
                                    key={cardSize.name}
                                    className={`rounded border px-2 py-2 text-left transition ${
                                        isSelected
                                            ? 'border-2 border-accent bg-accent/12 shadow-[0_0_10px_color-mix(in_oklab,var(--accent)_35%,transparent)]'
                                            : 'border border-border/70 bg-surface-secondary/45 text-muted hover:border-border-tertiary hover:bg-surface-secondary/70'
                                    }`}
                                    type='button'
                                    role='radio'
                                    aria-checked={isSelected}
                                    onClick={() => onCardSizeSelected(cardSize.name)}
                                >
                                    <div className='flex items-start gap-2'>
                                        <img
                                            alt=''
                                            aria-hidden='true'
                                            className={`${
                                                glyphClassMap[cardSize.name]
                                            } rounded-sm object-cover opacity-90`}
                                            src={IdentityDefault}
                                        />
                                        <span
                                            className={`pt-0.5 text-xs leading-tight ${
                                                isSelected ? 'text-foreground' : 'text-muted'
                                            }`}
                                        >
                                            {cardSize.label.charAt(0).toUpperCase() +
                                                cardSize.label.slice(1)}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    <div className='flex items-start justify-center md:justify-end'>
                        <div className='flex h-44 w-32 items-center justify-center rounded bg-surface-secondary/70 p-2'>
                            <img
                                alt={t('Card preview')}
                                className={`h-auto max-h-full ${
                                    sizeClassMap[selectedCardSize] || 'w-20'
                                } rounded`}
                                src={IdentityDefault}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCardSize;
