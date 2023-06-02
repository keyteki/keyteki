import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

const NavbarDropdown = ({ title, childLinks, rightSideMenu }) => {
    return (
        <div className={'navbar-item navbar-link'}>
            {title}
            <div
                className={`navbar-dropdown ${rightSideMenu && 'navbar-dropdown-right'} link-${
                    childLinks.length
                }`}
            >
                <div className={'navbar-dropdown-padding'} />
                {childLinks.map((link) => (
                    <div key={link.title}>
                        <Link
                            classname={'navbar-item navbar-link'}
                            key={link.title}
                            href={link.path}
                        >
                            {link.title}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

NavbarDropdown.propTypes = {
    childLinks: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string
};

export default NavbarDropdown;
