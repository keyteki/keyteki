import React from 'react';
import classNames from 'classnames';

import './Avatar.scss';

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
    const className = classNames('gravatar', {
        'pull-left': float
    });

    if (!imgPath) {
        return null;
    }

    return <img className={className} src={`/img/avatar/${imgPath}.png`} alt='' />;
};

export default Avatar;
