import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';
import NavbarDropdown from './NavbarDropdown';

const NavbarItem = ({ title, href, childLinks, children, rightSideMenu = false }) => {
    return childLinks ? (
        <NavbarDropdown childLinks={childLinks} title={title} rightSideMenu={rightSideMenu} />
    ) : href ? (
        <Link classname={'navbar-item navbar-link'} href={href}>
            {title}
            {children}
        </Link>
    ) : (
        <div className={'navbar-item'}>
            {title}
            {children}
        </div>
    );
};

NavbarItem.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    href: PropTypes.string,
    childLinks: PropTypes.arrayOf(PropTypes.object)
};

export default NavbarItem;
