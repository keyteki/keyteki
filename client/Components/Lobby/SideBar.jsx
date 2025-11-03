import React, { useState } from 'react';
import classNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';

/**
 * @typedef SidebarProps
 * @property {import('react').ReactNode | import('react').ReactNodeArray} [children]
 */

/**
 *
 * @param {SidebarProps} props
 */
const SideBar = ({ children }) => {
    const [expanded, setExpanded] = useState(false);

    const sidebarClass = classNames(
        'absolute left-0 top-16 bottom-0 bg-slate-900 z-50 overflow-y-auto transition-all duration-500 ease-in-out',
        expanded ? 'w-52' : 'w-10'
    );

    const linkClass = expanded ? 'text-red-500' : 'text-sky-500';
    const burgerClass = expanded ? 'float-right' : '';

    let icon = expanded ? faTimes : faBars;

    return (
        <div className={sidebarClass}>
            <a
                href='#'
                className={`${linkClass} ${burgerClass}`}
                onClick={() => setExpanded(!expanded)}
            >
                <FontAwesomeIcon icon={icon} />
            </a>
            {expanded && children}
        </div>
    );
};

SideBar.displayName = 'SideBar';

export default SideBar;
