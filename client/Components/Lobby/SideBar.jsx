import React, { useState } from 'react';
import classNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';

import './Sidebar.scss';

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

    let sidebarClass = classNames('sidebar', {
        expanded: expanded,
        collapsed: !expanded
    });

    let burgerClass = classNames('sidebar-button btn', {
        'float-right': expanded
    });

    let icon = expanded ? faTimes : faBars;

    return (
        <div className={sidebarClass}>
            <a href='#' className={burgerClass} onClick={() => setExpanded(!expanded)}>
                <FontAwesomeIcon icon={icon} />
            </a>
            {expanded && children}
        </div>
    );
};

SideBar.displayName = 'SideBar';

export default SideBar;
