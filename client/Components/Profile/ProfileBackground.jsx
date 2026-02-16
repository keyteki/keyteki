import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @typedef BackgroundOption
 * @property {string} name The name stored in the database
 * @property {string} label The label displayed to the user
 * @property {string} imageUrl The URL of the image for this background
 */

/**
 * @typedef BackgroundProps
 * @property {BackgroundOption[]} backgrounds The list of available backgrounds
 * @property {string} selectedBackground The currently selected background
 * @property {function(string, File): void} onBackgroundSelected Called when a background is selected
 */

/**
 * @param {BackgroundProps} props
 */
const ProfileBackground = ({
    backgrounds,
    selectedBackground,
    customBackground,
    onBackgroundSelected
}) => {
    const { t } = useTranslation();
    const uploadRef = useRef();
    const [localCustomBg, setCustomBg] = useState(
        customBackground ? `/img/bgs/${customBackground}.png` : null
    );
    const [fileError, setFileError] = useState(null);

    const allOptions = useMemo(() => backgrounds, [backgrounds]);

    const handleUploadChanged = (event) => {
        if (
            !event.currentTarget ||
            !event.currentTarget.files ||
            event.currentTarget.files.length === 0
        ) {
            return;
        }

        const file = event.currentTarget.files[0];

        if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            setFileError(t('File must be an image'));
            setCustomBg(null);
            return;
        }

        if (file.size / 1024 / 1024 > 5) {
            setFileError(t('File must be less than 5MB'));
            setCustomBg(null);
            return;
        }

        setCustomBg(URL.createObjectURL(file));
        onBackgroundSelected('custom', file);
        setFileError(null);
    };

    const renderTile = (background) => (
        <button
            key={background.name}
            className='text-left'
            type='button'
            onClick={() => onBackgroundSelected(background.name, null)}
        >
            <img
                alt={background.label}
                className={`h-[86px] w-full rounded object-cover ${
                    selectedBackground === background.name ? 'shadow-[0_0_1px_3px_#009648]' : ''
                }`}
                src={background.imageUrl}
            />
            <span className='mt-1 inline-block w-full text-center text-xs'>{background.label}</span>
        </button>
    );

    return (
        <div className='space-y-3'>
            <div className='flex items-center justify-between'>
                <div className='text-sm font-medium text-foreground'>
                    {t('Game Board Background')}
                </div>
            </div>
            <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                {allOptions.map((background) => renderTile(background))}
                <button
                    className='text-left'
                    type='button'
                    onClick={() => uploadRef.current?.click()}
                >
                    <img
                        alt={t('Custom')}
                        className={`h-[86px] w-full rounded object-cover ${
                            selectedBackground === 'custom' ? 'shadow-[0_0_1px_3px_#009648]' : ''
                        }`}
                        src={localCustomBg || backgrounds[0]?.imageUrl}
                    />
                    <span className='mt-1 inline-block w-full text-center text-xs'>
                        {t('Custom')}
                    </span>
                </button>
            </div>
            <input
                accept='image/*'
                hidden
                name='avatar'
                ref={uploadRef}
                type='file'
                onChange={handleUploadChanged}
            />
            {fileError && <div className='text-xs text-red-400'>{fileError}</div>}
        </div>
    );
};

export default ProfileBackground;
