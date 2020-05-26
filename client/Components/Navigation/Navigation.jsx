import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Link from './Link';
import { RightMenu, ProfileMenu, LeftMenu } from '../../menus';
import LanguageSelector from './LanguageSelector';
import ProfileDropdown from './ProfileDropdown';

import './Navigation.scss';

/**
 * @typedef { import('../../menus').MenuItem } MenuItem
 */

/**
 * @typedef NavigationProps
 * @property {string} appName The name of the application, displayed on the left hand side of the navbar
 * @property {User} user The currently logged in user
 */

/**
 * @param {NavigationProps} props
 */
const Navigation = (props) => {
    const { t } = useTranslation();

    /**
     * @param {MenuItem} menuItem The menu item
     * @param {User} user The logged in user
     * @returns {boolean} Whether or not the user can see this menu item
     */
    const userCanSeeMenu = (menuItem, user) => {
        return !menuItem.permission || (!!user && user.permissions[menuItem.permission]);
    };

    /**
     * Filter a list of menu items to what the logged in user can see
     * @param {MenuItem[]} menuItems The list of menu items
     * @param {User} user The logged in user
     * @returns {MenuItem[]} The filtered menu items
     */
    const filterMenuItems = (menuItems, user) => {
        const returnedItems = [];

        for (const menuItem of menuItems) {
            if (user && menuItem.showOnlyWhenLoggedOut) {
                continue;
            }

            if (!user && menuItem.showOnlyWhenLoggedIn) {
                continue;
            }

            if (!userCanSeeMenu(menuItem, user)) {
                continue;
            }

            returnedItems.push(menuItem);
        }

        return returnedItems;
    };

    /**
     * Render a list of menu items to react components
     * @param {MenuItem[]} menuItems The menu items
     * @returns {JSX.Element[]} The list of rendered menu items
     */
    const renderMenuItems = (menuItems) => {
        return filterMenuItems(menuItems, props.user).map((menuItem) => {
            const children =
                menuItem.childItems && filterMenuItems(menuItem.childItems, props.user);
            if (children && children.length > 0) {
                return (
                    <NavDropdown
                        key={menuItem.title}
                        title={menuItem.title}
                        id={`nav-${menuItem.title}`}
                    >
                        {children.map((menuItem) => {
                            if (!menuItem.path) {
                                return <></>;
                            }

                            return (
                                <Link key={menuItem.path} href={menuItem.path}>
                                    <NavDropdown.Item>{t(menuItem.title)}</NavDropdown.Item>
                                </Link>
                            );
                        })}
                    </NavDropdown>
                );
            }

            if (!menuItem.path) {
                return <></>;
            }

            return (
                <Link key={menuItem.path || menuItem.title} href={menuItem.path}>
                    <Nav.Link>{t(menuItem.title)}</Nav.Link>
                </Link>
            );
        });
    };

    return (
        <Navbar bg='dark' variant='dark' className='navbar-sm' fixed='top'>
            <Navbar.Brand href='/'></Navbar.Brand>
            <Navbar.Toggle aria-controls='navbar' />
            <Nav>{renderMenuItems(LeftMenu)}</Nav>
            <Navbar.Collapse id='navbar' className='justify-content-end'>
                <Nav className='ml-auto pr-md-5'>
                    {renderMenuItems(RightMenu)}
                    <ProfileDropdown menu={ProfileMenu} user={props.user} />
                    <LanguageSelector />
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;
