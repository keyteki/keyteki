import React from 'react';
import classNames from 'classnames';

import './Avatar.scss';

/**
 * @typedef AvatarProps
 * @property {boolean} [float] Whether or not to float the image
 * @property {string} username The username whose avatar to display
 */

/**
 *
 * @param {AvatarProps} props
 */
const Avatar = ({ float, username }) => {
    const className = classNames('gravatar', {
        'pull-left': float
    });

    if (!username) {
        return null;
    }

    return <img className={className} src={`/img/avatar/${username}.png`} alt='' />;
};

export default Avatar;
