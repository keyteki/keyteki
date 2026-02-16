import React from 'react';
import { Avatar as HeroAvatar } from '@heroui/react';

/**
 * @typedef AvatarProps
 * @property {boolean} [float] Whether or not to float the image
 * @property {string} imgPath The username whose avatar to display
 */

/**
 *
 * @param {AvatarProps} props
 */
const Avatar = ({ float, imgPath }) => {
    const className = `gravatar size-8 shrink-0 align-middle mr-[5px]${float ? ' float-left' : ''}`;
    const imageSrc = imgPath ? `/img/avatar/${imgPath}.png` : undefined;

    return (
        <HeroAvatar className={className} size='sm'>
            {imageSrc && <HeroAvatar.Image alt='' src={imageSrc} />}
            <HeroAvatar.Fallback>?</HeroAvatar.Fallback>
        </HeroAvatar>
    );
};

export default Avatar;
